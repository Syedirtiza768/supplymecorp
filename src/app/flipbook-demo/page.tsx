/**
 * Enhanced Flipbook Demo Page
 * 
 * This page demonstrates the enhanced flipbook with all features enabled.
 * Access it at: /flipbook-demo
 */

import MyFlipBookEnhanced from "@/components/custom/MyFlipBookEnhanced";
import { KeyboardShortcutsHelp } from "@/components/flipbook/FlipbookKeyboardHandler";

export default function FlipbookDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Enhanced Flipbook Demo
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience our fully-featured interactive catalog with page-flip animations, 
            zoom controls, thumbnails, table of contents, and keyboard shortcuts.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          <FeatureCard
            icon="🎯"
            title="Interactive Navigation"
            description="Navigate with buttons, keyboard, or click on page edges"
          />
          <FeatureCard
            icon="🔍"
            title="Zoom & Pan"
            description="Zoom in for details and pan around the page"
          />
          <FeatureCard
            icon="📱"
            title="Fully Responsive"
            description="Optimized for desktop, tablet, and mobile devices"
          />
          <FeatureCard
            icon="📑"
            title="Thumbnails"
            description="Quick navigation with thumbnail strip (Press T)"
          />
          <FeatureCard
            icon="📋"
            title="Table of Contents"
            description="Jump to chapters instantly (Press C)"
          />
          <FeatureCard
            icon="⌨️"
            title="Keyboard Shortcuts"
            description="Arrow keys, zoom, fullscreen, and more"
          />
        </div>

        {/* Flipbook */}
        <div className="mb-8">
          <MyFlipBookEnhanced />
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
          <KeyboardShortcutsHelp />
        </div>

        {/* Tips */}
        <div className="max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">💡 Tips</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Click on the left or right edge of the page to flip</li>
            <li>• Use arrow keys for quick navigation</li>
            <li>• Press <kbd className="px-2 py-1 bg-white rounded text-xs">T</kbd> to toggle thumbnails</li>
            <li>• Press <kbd className="px-2 py-1 bg-white rounded text-xs">C</kbd> to open table of contents</li>
            <li>• Press <kbd className="px-2 py-1 bg-white rounded text-xs">F</kbd> for fullscreen mode</li>
            <li>• Zoom in with <kbd className="px-2 py-1 bg-white rounded text-xs">+</kbd> and drag to pan</li>
            <li>• Share specific pages by copying the URL (includes ?page=X)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string; 
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
