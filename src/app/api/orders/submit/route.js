export async function POST(req) {
  try {
    // Get order data from request
    const { customer, cartItems, shippingAddress, specialInstructions } = await req.json();

    // Validate required data
    if (!customer || !customer.custNo) {
      return new Response(JSON.stringify({ error: 'Customer information is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!cartItems || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get Counterpoint credentials from environment
    const apiKey = process.env.CUSTOMERS_API_KEY;
    const auth = process.env.CUSTOMERS_AUTH;
    const apiBaseUrl = process.env.COUNTERPOINT_API_URL || 'https://utility.rrgeneralsupply.com';
    
    // Store configuration
    const strId = process.env.COUNTERPOINT_STR_ID || '1';
    const staId = process.env.COUNTERPOINT_STA_ID || 'VIR-1';
    const drwId = process.env.COUNTERPOINT_DRW_ID || 'ERICK';
    const usrId = process.env.COUNTERPOINT_USR_ID || 'IRTIZA';
    const taxCode = process.env.COUNTERPOINT_TAX_CODE || 'LOCAL';

    if (!apiKey || !auth) {
      console.error('Missing Counterpoint API credentials');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build shipping address (use shipping if provided, otherwise use customer address)
    const shipTo = shippingAddress || {
      firstName: customer.firstName,
      lastName: customer.lastName,
      address1: customer.address,
      city: customer.city,
      state: customer.state,
      zip: customer.zip,
      phone: customer.phone
    };

    // Format line items for Counterpoint
    const psDocLines = cartItems.map((item, index) => ({
      LIN_SEQ_NO: index + 1,
      LIN_TYP: 'O',
      ITEM_NO: item.productId || item.sku || item.itemNo,
      QTY_SOLD: item.qty || item.quantity || 1,
      PRC: parseFloat(item.price || item.priceSnapshot || 0),
      USR_ENTD_PRC: 'Y',
      TAX_COD: taxCode
    }));

    // Calculate order total for payment
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price || item.priceSnapshot || 0);
      const qty = item.qty || item.quantity || 1;
      return sum + (price * qty);
    }, 0);
    const taxRate = 0.08875; // NY tax rate
    const tax = subtotal * taxRate;
    const orderTotal = subtotal + tax;

    // Build order notes
    const timestamp = new Date().toISOString();
    const orderNotes = [
      {
        NOTE_ID: 'WEB_ORDER',
        NOTE: `Order placed via web on ${timestamp}`
      },
      {
        NOTE_ID: 'PAID',
        NOTE: 'Paid in full via web'
      }
    ];

    if (specialInstructions) {
      orderNotes.push({
        NOTE_ID: 'SPECIAL_INST',
        NOTE: specialInstructions
      });
    }

    // Build the Counterpoint order payload
    const orderPayload = {
      PS_DOC_HDR: {
        STR_ID: strId,
        STA_ID: staId,
        DRW_ID: drwId,
        TKT_TYP: 'T',
        DOC_TYP: 'O', // Order type
        USR_ID: usrId,
        CUST_NO: customer.custNo,
        TAX_COD: taxCode,
        BILL_TO_CONTACT: {
          FST_NAM: customer.firstName || '',
          LST_NAM: customer.lastName || '',
          ADRS_1: customer.address || '',
          CITY: customer.city || '',
          STATE: customer.state || '',
          ZIP_COD: customer.zip || '',
          PHONE_1: customer.phone || '',
          EMAIL_ADRS_1: customer.email || '',
          NAM_TYP: 'P'
        },
        SHIP_TO_CONTACT: {
          FST_NAM: shipTo.firstName || customer.firstName || '',
          LST_NAM: shipTo.lastName || customer.lastName || '',
          ADRS_1: shipTo.address1 || customer.address || '',
          CITY: shipTo.city || customer.city || '',
          STATE: shipTo.state || customer.state || '',
          ZIP_COD: shipTo.zip || customer.zip || '',
          PHONE_1: shipTo.phone || customer.phone || '',
          NAM_TYP: 'P'
        },
        PS_DOC_LIN: psDocLines,
        PS_DOC_NOTE: orderNotes
      }
    };

    console.log('Submitting order to Counterpoint:', JSON.stringify(orderPayload, null, 2));

    // Submit to Counterpoint API
    const response = await fetch(`${apiBaseUrl}/Document`, {
      method: 'POST',
      headers: {
        'APIKey': apiKey,
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Counterpoint API error:', response.status, errorText);
      return new Response(JSON.stringify({ 
        error: 'Failed to submit order to Counterpoint',
        details: errorText,
        status: response.status
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = await response.json();
    console.log('Counterpoint API response:', JSON.stringify(result, null, 2));

    // Check for success
    if (result.ErrorCode === 'SUCCESS' && result.Documents && result.Documents.length > 0) {
      const orderDoc = result.Documents.find(doc => doc.reference === 'Order') || result.Documents[0];
      
      return new Response(JSON.stringify({
        success: true,
        orderId: orderDoc.DOC_ID,
        orderNumber: orderDoc.DOC_NO || orderDoc.DOC_ID,
        message: 'Order submitted successfully',
        details: orderDoc
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({
        error: 'Order submission failed',
        message: result.Message || 'Unknown error',
        errorCode: result.ErrorCode
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Order submission error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process order',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
