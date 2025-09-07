'use client';

import { FloatingSupportWidget } from './FloatingSupportWidget';

/**
 * Example component showing how to use both widget types
 * This demonstrates the prop usage for switching between custom and default widgets
 */
export function WidgetExample() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Support Widget Examples</h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Custom React Widget (Default)</h2>
        <p className="text-gray-600">
          This uses our custom React component with full control over styling and behavior.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <code className="text-sm">
            {`<FloatingSupportWidget useDefaultWidget={false} />`}
          </code>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Default ElevenLabs Widget</h2>
        <p className="text-gray-600">
          This uses the official ElevenLabs widget with their default styling and behavior.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <code className="text-sm">
            {`<FloatingSupportWidget useDefaultWidget={true} />`}
          </code>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">With Custom Agent ID</h2>
        <p className="text-gray-600">
          You can also specify a custom agent ID for different support scenarios.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <code className="text-sm">
            {`<FloatingSupportWidget 
  agentId="custom_agent_123" 
  useDefaultWidget={true} 
/>`}
          </code>
        </div>
      </div>

      {/* Live Examples */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Live Examples</h2>
        <p className="text-gray-600">
          Try both widget types below (they will appear in the bottom-right corner):
        </p>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => {
              // This would typically be handled by state management
              console.log('Switch to custom widget');
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Use Custom Widget
          </button>
          
          <button 
            onClick={() => {
              // This would typically be handled by state management
              console.log('Switch to default widget');
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Use Default Widget
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Usage in your app:
 * 
 * // For custom React widget (default)
 * <FloatingSupportWidget />
 * 
 * // For default ElevenLabs widget
 * <FloatingSupportWidget useDefaultWidget={true} />
 * 
 * // With custom agent ID
 * <FloatingSupportWidget 
 *   agentId="your_custom_agent_id" 
 *   useDefaultWidget={true} 
 * />
 */
