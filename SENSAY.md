Getting Started
To use the Sensay AI API, you'll need an API key and a Replica UUID. The SDK will help you manage replicas and interact with the API.

Initializing the Sensay API Client

import { SensayAPI } from '@/sensay-sdk';

// Import required constants
import { SAMPLE_USER_ID, SAMPLE_REPLICA_SLUG, API_VERSION } from '@/constants/auth';

// 1. Initialize organization-only client (no user authentication)
const orgClient = new SensayAPI({
  HEADERS: {
    'X-ORGANIZATION-SECRET': process.env.NEXT_PUBLIC_SENSAY_API_KEY_SECRET
  }
});

// 2. Check if sample user exists
let userExists = false;
try {
  await orgClient.users.getV1Users(SAMPLE_USER_ID);
  userExists = true;
} catch (error) {
  console.log('User does not exist, will create');
}

// 3. Create user if needed
if (!userExists) {
  await orgClient.users.postV1Users(API_VERSION, {
    id: SAMPLE_USER_ID,
    email: `${SAMPLE_USER_ID}@example.com`,
    name: "Sample User"
  });
}

// 4. Initialize user-authenticated client for further operations
const client = new SensayAPI({
  HEADERS: {
    'X-ORGANIZATION-SECRET': process.env.NEXT_PUBLIC_SENSAY_API_KEY_SECRET,
    'X-USER-ID': SAMPLE_USER_ID
  }
});
Copy
Basic Chat Completion
Send a message to the API and receive a completion response:

Creating a Chat Completion

// Simple chat completion

// 1. List replicas to find our sample replica
const replicas = await client.replicas.getV1Replicas();
let replicaId;

// 2. Look for the sample replica by slug
if (replicas.items && replicas.items.length > 0) {
  const sampleReplica = replicas.items.find(replica => replica.slug === SAMPLE_REPLICA_SLUG);
  if (sampleReplica) {
    replicaId = sampleReplica.uuid;
  }
}

// 3. Create the sample replica if it doesn't exist
if (!replicaId) {
  const newReplica = await client.replicas.postV1Replicas(API_VERSION, {
    name: "Sample Replica",
    shortDescription: "A sample replica for demonstration",
    greeting: "Hello, I'm the sample replica. How can I help you today?",
    slug: SAMPLE_REPLICA_SLUG,
    ownerID: SAMPLE_USER_ID,
    llm: {
      model: "claude-3-7-sonnet-latest",
      memoryMode: "prompt-caching",
      systemMessage: "You are a helpful AI assistant that provides clear and concise responses."
    }
  });
  replicaId = newReplica.uuid;
}

// 4. Use the replica for chat completion
const response = await client.chatCompletions.postV1ReplicasChatCompletions(
  replicaId,
  API_VERSION,
  {
    content: 'Hello, how can you help me today?',
    source: 'web',
    skip_chat_history: false
  }
);

console.log(response.content);
Copy
OpenAI-Compatible Endpoint
If you need OpenAI-compatible response formatting, you can use the experimental endpoint:

OpenAI-Compatible Chat Completion

// Using the OpenAI-compatible experimental endpoint

// First get your replica ID (same steps as in the previous example)
const replicas = await client.replicas.getV1Replicas();
let replicaId;

if (replicas.items && replicas.items.length > 0) {
  const sampleReplica = replicas.items.find(replica => replica.slug === SAMPLE_REPLICA_SLUG);
  if (sampleReplica) {
    replicaId = sampleReplica.uuid;
  }
}

// If you need OpenAI-compatible formatting, you can use the experimental endpoint
const response = await client.chatCompletions.postV1ExperimentalReplicasChatCompletions(
  replicaId,
  {
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello, how can you help me today?' }
    ],
    source: 'web',
    store: true
  }
);

// This response will include OpenAI-compatible format with choices array
console.log(response.choices[0].message.content);

// Note: The API does not currently support streaming. Attempting to use
// EventSource or setting up streaming with the 'Accept: text/event-stream'
// header will result in errors.




Sensay API
2025-03-25
Base URL
https://api.sensay.io
Introduction
This is the API for Sensay Platform.

You can find out more about Sensay at https://sensay.io.

Interested in using our API? You can request an API key by visiting the Sensay API account request form.

This API is an OpenAPI 3.0.0 (previously known as Swagger) API and as such you can make use of the extensive tools developed for OpenAPI: find them at https://tools.openapis.org.

You can play around with the API via Swagger UI at https://api.sensay.io/ui.



Please note that we are constantly evolving our API.

Join the Sensay API announcements Telegram channel to be notified in advance of breaking changes and new major features.

This is version 2025-03-25 of this API documentation. Last update on Aug 27, 2025.

Getting started
In this Getting started guide, we will assume you have already obtained your organization's Secret Service Token, which you will need to use in your server-to-server requests against https://api.sensay.io.

Walkthrough


All API requests must include a Content-Type header.



Specifying the API version as a X-API-Version header is highly recommended, as it will allow you to handle breaking changes without errors. All breaking changes are announced on our Sensay API Telegram Channel.

Set your variables
export USER_ID=test_user_id
export ORGANIZATION_SECRET=your_secret_token
export API_VERSION=2025-03-25
1. Create a user in your organization
Each organization can have many users. We will first create a new user for your organization:

curl -X POST https://api.sensay.io/v1/users \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "X-API-Version: $API_VERSION" \
 -H "Content-Type: application/json" \
 -d '{"id": "'"$USER_ID"'"}'
Example response:

{ "id": "test_user_id", "linkedAccounts": [] }
The id field is optional and allows you to provide a unique identifier for the user in your organization. It is used to identify the user in further requests. If you do not provide a user id, the API will generate a unique one for you:

curl -X POST https://api.sensay.io/v1/users \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "X-API-Version: $API_VERSION" \
 -H "Content-Type: application/json" \
 -d '{}'
Example response:

{ "id": "12345678-1234-1234-1234-123456789abc", "linkedAccounts": [] }
2. Create a user replica in your organization
Replicas belong to users, so we can create a new replica belonging to the user we created:

curl -X POST https://api.sensay.io/v1/replicas \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "X-API-Version: $API_VERSION" \
 -H "Content-Type: application/json" \
 -d '{
   "name": "My Replica",
   "shortDescription": "A helpful assistant",
   "greeting": "Hi there! How can I help you today?",
   "ownerID": "'"$USER_ID"'",
   "private": false,
   "slug": "my-replica",
   "llm": {
     "provider": "openai",
     "model": "gpt-4o"
   }
 }'
You will get a response similar to this one with the replica UUID returned.

{"success": true, "uuid": "12345678-1234-1234-1234-123456789abc"}
Export the replica UUID to use it in the next steps.

export REPLICA_UUID=copy_and_paste_the_uuid_returned_above
3. List replicas accessible by the user of your organization
curl -X GET https://api.sensay.io/v1/replicas \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "X-API-Version: $API_VERSION" \
 -H "Content-Type: application/json" \
 -H "X-USER-ID: $USER_ID"
The response will include all replicas that the user has access to, including private ones:

{
  "success": true,
  "type": "array",
  "items": [
    {
      "uuid": "12345678-1234-1234-1234-123456789abc",
      "name": "My Replica",
      "slug": "my-replica",
      "profile_image": "https://studio.sensay.io/assets/default-replica-profile.webp",
      "short_description": "A helpful assistant",
      "introduction": "Hi there! How can I help you today?",
      "tags": [],
      "created_at": "2025-04-15T08:05:03.167222+00:00",
      "owner_uuid": "12345678-1234-1234-1234-123456789abc",
      "voice_enabled": false,
      "video_enabled": false,
      "chat_history_count": 0,
      "system_message": "",
      "telegram_service_name": null,
      "discord_service_name": null,
      "discord_is_active": null,
      "telegram_integration": null,
      "discord_integration": null
    }
  ],
  "total": 1
}

Alternatively, list all replicas within your Organization, including private ones:

curl -X GET https://api.sensay.io/v1/replicas \
 -H "Content-Type: application/json" \
 -H "X-API-Version: $API_VERSION" \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET"


By not specifying X-USER-ID you are performing the request as an admin, hence listing all replicas within your Organization, including non-listed and private ones.

4. Get all chat history between a user and a replica
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/chat/history \
 -H "Content-Type: application/json" \
 -H "X-API-Version: $API_VERSION" \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "X-USER-ID: $USER_ID"
Initially, after creation, the chat history will be empty:

{
  "success": true,
  "type": "array",
  "items": []
}
5. Chat with a replica
curl -X POST https://api.sensay.io/v1/replicas/$REPLICA_UUID/chat/completions \
 -H "Content-Type: application/json" \
 -H "X-API-Version: $API_VERSION" \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "X-USER-ID: $USER_ID" \
 -d '{"content":"How did you handle the immense pressure during the Civil War?"}'
The response of the request include the chat response:

{
  "success": true,
  "content": "I don't have enough information to answer that question."
}
6. Retrieve the chat history again
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/chat/history \
 -H "Content-Type: application/json" \
 -H "X-API-Version: $API_VERSION" \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "X-USER-ID: $USER_ID"
Response now includes the chat message and its response:

{
  "success": true,
  "type": "array",
  "items": [
    {
      "id": 668,
      "created_at": "2025-04-15T08:11:00.093761+00:00",
      "content": "How did you handle the immense pressure during the Civil War?",
      "role": "user",
      "is_private": false,
      "source": "web",
      "replica_uuid": "4da68021-78a7-4fa2-91c1-ea2e5986e06f",
      "is_archived": false,
      "replica_slug": "my-replica",
      "user_uuid": "210bb355-193d-4ed0-8223-5802710438c9",
      "sources": []
    },
    {
      "id": 669,
      "created_at": "2025-04-15T08:11:00.299349+00:00",
      "content": "Response content",
      "role": "assistant",
      "is_private": false,
      "source": "web",
      "replica_uuid": "4da68021-78a7-4fa2-91c1-ea2e5986e06f",
      "is_archived": false,
      "replica_slug": "my-replica",
      "user_uuid": "210bb355-193d-4ed0-8223-5802710438c9",
      "sources": []
    }
  ]
}
7. Train your replica with custom knowledge
To make your replica more useful, you can train it with custom knowledge. Let's add some information about your company:

Create a knowledge base entry
curl -X POST https://api.sensay.io/v1/replicas/$REPLICA_UUID/training \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "X-API-Version: $API_VERSION" \
 -H "Content-Type: application/json" \
 -d '{}'
Example response:

{
  "success": true,
  "knowledgeBaseID": 12345
}
Export the knowledge base ID to use it in the next step:

export KNOWLEDGE_BASE_ID=12345
Add information to the knowledge base entry
curl -X PUT https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/$KNOWLEDGE_BASE_ID \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "X-API-Version: $API_VERSION" \
 -H "Content-Type: application/json" \
 -d '{
   "rawText": "Our company was founded in 2020. We specialize in AI-powered customer service solutions. Our business hours are Monday to Friday, 9 AM to 5 PM Eastern Time. We offer a 30-day money-back guarantee on all our products."
 }'
Example response:

{
  "success": true
}
Test your trained replica
Now you can ask your replica about the information you just added:

curl -X POST https://api.sensay.io/v1/replicas/$REPLICA_UUID/chat/completions \
 -H "Content-Type: application/json" \
 -H "X-API-Version: $API_VERSION" \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "X-USER-ID: $USER_ID" \
 -d '{"content":"What are your business hours?"}'
Example response:

{
  "success": true,
  "content": "Our business hours are Monday to Friday, 9 AM to 5 PM Eastern Time."
}


The replica will now be able to answer questions based on the information you provided. For more advanced training options, see the Training documentation.

Conceptual model
The following diagram shows a simplified version of the entities you can interact with via the API. Refer to the endpoints documentation for a complete and up to date description of the entities.

Hierarchical structure
Organizations are the top-level entities that own users, users own replicas, and replicas are trained on training data (knowledge base).

Access control
Organizations cannot access each other's data (e.g. users, replicas, training data, ...).

A user can interact with a replica if they own it, or if the replica is public.

Chat history is owned by both users and replicas.

Diagram
Conceptual Model Diagram

Generating the SDK
The Sensay API provides an OpenAPI specification that allows you to automatically generate client SDKs for your preferred programming language and framework. Now that you familiarised with the API and its capabilities in the Getting started chapter, we will walk you through generating a TypeScript SDK using HeyAPI, though many other tools and languages are supported. See https://tools.openapis.org for a comprehensive list of the available tools.

1. Install HeyAPI or your preferred SDK generator
For this guide, we'll use HeyAPI, but many other generators are available depending on your needs.

From your project directory:

# Install HeyAPI
npm install @heyapi/cli
2. Generate a TypeScript SDK
# Generate a TypeScript SDK
npx heyapi generate-sdk \
  --input="https://api.sensay.io/schema" \
  --output-dir="./sensay-sdk" \
  --language="typescript" \
  --client="fetch"


The above command generates a TypeScript SDK with the fetch client. HeyAPI supports multiple client options including axios, angular, and more.

3. Install and configure the generated SDK
# Install the generated SDK dependencies
cd sensay-sdk
npm install

# Build the SDK
npm run build
4. Use the generated SDK in your application
import { Configuration, DefaultApi } from './sensay-sdk';

// Configure the SDK with your organization secret and API version
const config = new Configuration({
  basePath: 'https://api.sensay.io',
  headers: {
    'X-ORGANIZATION-SECRET': 'your_secret_token',
    'X-API-Version': '2025-05-01',
    'Content-Type': 'application/json'
  }
});

// Initialize the API client
const api = new DefaultApi(config);

// Create a user
const createUser = async () => {
  try {
    const response = await api.createUser({
      id: 'test_user_id'
    });
    console.log('User created:', response);
    return response;
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Create a replica for the user
const createReplica = async (userId: string) => {
  try {
    const response = await api.createReplica({
      name: 'My SDK Replica',
      shortDescription: 'Created with the generated SDK',
      greeting: 'Hello! I was created using a generated SDK.',
      ownerID: userId,
      private: false,
      slug: 'sdk-replica',
      llm: {
        provider: 'openai',
        model: 'gpt-4o'
      }
    });
    console.log('Replica created:', response);
    return response;
  } catch (error) {
    console.error('Error creating replica:', error);
  }
};

// Chat with a replica
const chatWithReplica = async (replicaUuid: string, userId: string) => {
  try {
    // Note: Headers are configured at the client level, but can be overridden per request
    const response = await api.chatCompletions(replicaUuid, {
      content: 'Hello, I'm using the generated SDK!'
    }, {
      headers: {
        'X-USER-ID': userId,
        'X-ORGANIZATION-SECRET': 'your_secret_token', 
        'X-API-Version': '2025-03-25',
        'Content-Type': 'application/json'
      }
    });
    console.log('Chat response:', response);
    return response;
  } catch (error) {
    console.error('Error chatting with replica:', error);
  }
};

// Example usage
const main = async () => {
  const user = await createUser();
  if (user && user.id) {
    const replica = await createReplica(user.id);
    if (replica && replica.uuid) {
      await chatWithReplica(replica.uuid, user.id);
    }
  }
};

main();
Authentication in the SDK
For all API requests, you must include the proper authentication headers as described in the Authentication documentation:

// Configure global headers for all requests
const config = new Configuration({
  basePath: 'https://api.sensay.io/v1',
  headers: {
    // Required for all requests
    'X-ORGANIZATION-SECRET': 'your_secret_token',
    'X-API-Version': '2025-03-25',
    'Content-Type': 'application/json'
  }
});

// For user-specific operations, add the X-USER-ID header to individual requests
const response = await api.someUserSpecificOperation(params, {
  headers: {
    'X-USER-ID': 'user_id'
  }
});


The X-ORGANIZATION-SECRET header is required for all API requests. For operations that involve a specific user, you must also include the X-USER-ID header.

Alternative SDK Generation Tools
While HeyAPI is a great option, there are several other tools you can use to generate SDKs:

OpenAPI Generator - Supports 50+ languages and frameworks
Swagger Codegen - The original SDK generator for OpenAPI
NSwag - Excellent for .NET applications
openapi-typescript - TypeScript-specific generator with great type safety
Supported Languages and Frameworks
The OpenAPI ecosystem supports SDK generation for numerous languages and frameworks, including but not limited to:

TypeScript/JavaScript (Node.js, Browser, React, Angular, Vue)
Python
Java
C#/.NET
Go
Ruby
PHP
Swift
Kotlin
Rust
Dart/Flutter


For specific instructions on generating SDKs for other languages, please refer to the documentation of your chosen SDK generator.

Best Practices
Version your SDK: Always specify the API version in your SDK configuration to ensure compatibility.
Error handling: Implement proper error handling in your client code to catch and process API errors.
Authentication: Securely store and provide your organization's secret token.
Rate limiting: Implement retry mechanisms and respect API rate limits.
Keep up to date: Regularly update your SDK when new API versions are released.


Never hardcode your organization's secret token in client-side code. Always use environment variables or a secure configuration management system.

Further Resources
OpenAPI Specification
Authentication
You must authenticate your requests to secured endpoints using your organization secret X-ORGANIZATION-SECRET:

Method 1: Authenticating as an organization admin
Required headers:

X-ORGANIZATION-SECRET


When authenticating in this way, your request is performed as an admin and has full access to the organization.

Method 2: Authenticating as a user
Your request can authenticate as a specific user that belongs to your organization. To do so, in addition to the Service Token, you need to provide the user's ID in the following header:

Required headers:

X-ORGANIZATION-SECRET
X-USER-ID


If the specified user does not exist in Sensay API, an unauthorized error will be returned.

Method 3: Authenticating as user by one of their linked accounts' ID
You can also authenticate as a user by alternative IDs that have been associated to the user using the Users endpoints.

To do so, in addition to the Service Token and the user's ID, you need to provide the user's ID type in the following header:

Required headers:

X-ORGANIZATION-SECRET
X-USER-ID
X-USER-ID-TYPE
See POST /users for the list of supported IDs.



If the specified user does not exist in Sensay API, an unauthorized error will be returned.

Responses
Responses can be of three base types:

1. Successful response representing an Object:
  {
    "success": "true",
    "some_key": {
      "...": "..."
    }
  }
2. Successful response representing an Array:
  {
    "success": "true",
    "items": [
      {
        "...": "..."
      }
    ]
  }
3. Error response:
  {
    "success": "false",
    "message": "...",
    "...": "..."
  }
Pagination
The Sensay API uses offset-based pagination for most list endpoints, providing a familiar page-based navigation pattern that's easy to implement in user interfaces.

How offset-based pagination works
Offset-based pagination uses page numbers and page sizes, making it familiar and easy to implement UI components like page selectors and "showing X of Y results" displays.

Parameters
page: The page number (starting from 1)
pageSize: Number of items per page (typically 1-100)
The response includes a total field showing the complete number of available items.

Example: List conversations
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations?page=2&pageSize=20" \
  -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
  -H "X-API-Version: $API_VERSION" \
  -H "Content-Type: application/json"
Response:

{
  "success": true,
  "items": [
    {
      "uuid": "8e9309af-baa4-4a85-8c59-c3a2a0c2ad0f",
      "source": "web",
      "messageCount": 42,
      "firstMessageAt": "2025-05-27T15:02:44.499744+00:00",
      "lastMessageAt": "2025-05-27T15:02:44.499744+00:00"
    }
  ],
  "total": 156
}
Implementation pattern
// Calculate pagination info
const totalPages = Math.ceil(response.total / pageSize);
const hasNextPage = currentPage < totalPages;
const hasPrevPage = currentPage > 1;

// Navigation
const nextPageUrl = hasNextPage ? 
  `/conversations?page=${currentPage + 1}&pageSize=${pageSize}` : null;
const prevPageUrl = hasPrevPage ? 
  `/conversations?page=${currentPage - 1}&pageSize=${pageSize}` : null;

// Display info
const startItem = (currentPage - 1) * pageSize + 1;
const endItem = Math.min(currentPage * pageSize, response.total);
console.log(`Showing ${startItem}-${endItem} of ${response.total} results`);
Building pagination UI
function createPaginationControls(currentPage, totalPages) {
  const controls = [];

  // Previous button
  if (currentPage > 1) {
    controls.push({
      type: 'previous',
      page: currentPage - 1,
      label: 'Previous'
    });
  }

  // Page numbers (show 5 pages max)
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let page = startPage; page <= endPage; page++) {
    controls.push({
      type: 'page',
      page: page,
      label: page.toString(),
      active: page === currentPage
    });
  }

  // Next button
  if (currentPage < totalPages) {
    controls.push({
      type: 'next',
      page: currentPage + 1,
      label: 'Next'
    });
  }

  return controls;
}
Best practices
Performance
Choose appropriate page sizes:

10-50 items for UI lists with good user experience
Up to 100 for data processing or admin interfaces
Avoid very large page sizes that may cause timeouts
Cache responses when possible:

List endpoints often return stable data
Cache total counts separately as they change less frequently
Error handling
async function fetchPage(page, pageSize) {
  try {
    const response = await fetch(`/conversations?page=${page}&pageSize=${pageSize}`);

    if (!response.ok) {
      if (response.status === 404) {
        // Page doesn't exist, redirect to last valid page
        return fetchPage(1, pageSize);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Pagination error:', error);
    throw error;
  }
}
UI considerations
Loading states: Show loading indicators during page transitions
Empty states: Handle cases where no items are returned (page 1 with 0 total)
Invalid pages: Gracefully handle requests for pages that don't exist
URL synchronization: Keep browser URL in sync with current page for bookmarking
Versioning
Our API uses date-based versioning via the X-API-Version header. The value you provide—any valid date in the YYYY-MM-DD format—represents the exact state of the API as it existed on that day. This design allows you to pin your integration to a specific API snapshot or automatically track the latest stable behavior.

Specifying the API version
Any date allowed: You may pass any valid date in the X-API-Version header. The date you choose directly corresponds to the API state at that point in time.
Optional header: Including the header is optional; if omitted, the API defaults to the latest stable version.
Response details
Each API response includes an X-API-Version header that shows the version (date) of the API that processed your request. This ensures transparency, so you're always aware of the API state applied to your request.

Migrating to a newer version
When migrating to a newer API version, specify the current date in the header. This deliberate action helps transition your integration to the updated API behavior.

Versioning Policy
Breaking changes only: New version dates are introduced only when breaking changes occur, requiring client-side adaptations.
Non-breaking updates: Enhancements such as additional response fields are deployed without updating the API version.
Beta features
Features marked with the Beta badge are experimental and might be changed or removed without notice.



Our API is always evolving, therefore we recommend to regularly monitor for new version releases and update your integration accordingly.

Please refer to our Telegram channel for updates: Sensay API Announcements Telegram channel.

Feature requests
You can submit your feature request at this link: https://sensay.canny.io/features

Troubleshooting
Issue	How to fix it
You cannot find a replica	Make sure that the user belongs to the same organization of the replica you are trying to interact with. Make sure that your user owns the replica or that the replica is public.
HTTP 401	You are not authenticated or authorized. Either your API key is missing or invalid, your organization is disabled, or the user you specified does not exist. Please check your API key, user ID, and user ID type.
HTTP 415	The request is missing a valid "Content-Type" header. Supported media types include "application/json".
HTTP 429	You are hitting the rate limit as you exceeded the number of requests allowed for your organization or API key. Please slow down or contact us to discuss raising your limit.
Time-out	We time-out requests after 90 seconds. If your requests times-out before that, or times-out consistently, please report it at this link: https://sensay.canny.io/bugs.
HTTP 500	This error is usually due to an internal error on our end. Please make a note of the response fingerprint and requestID, and contact us to report it here: https://sensay.canny.io/bugs.
Something else	Please file a bug report at this link: https://sensay.canny.io/bugs.
In-depth: Conversations
The Sensay API provides access to conversation data and messages through specialized endpoints that use cursor-based pagination for efficient navigation through large message histories. Analytics endpoints provide aggregated insights into your replicas' usage patterns and performance metrics.

Conversation mentions
The mentions endpoint allows you to retrieve conversation messages grouped into "mention groups" (containing replica replies and context) and "placeholder groups" (representing collapsed user-only messages).

Conversation messages
The messages endpoint allows you to retrieve conversation messages. This is useful for expanding placeholders received from the mentions endpoint.

Cursor-based pagination
Conversation endpoints use cursor-based pagination with unique identifiers (UUIDs) to navigate through datasets. This approach is efficient for large datasets and handles concurrent changes gracefully.

Parameters
limit: Number of items to fetch (1-100)
beforeUUID: Return items before this UUID (excluding the UUID itself)
afterUUID: Return items after this UUID (excluding the UUID itself)
Basic usage
Get the first page (latest mentions):

curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/mentions?limit=20" \
  -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
  -H "X-API-Version: $API_VERSION" \
  -H "Content-Type: application/json"
Response:

{
  "success": true,
  "items": [
    {
      "type": "mention",
      "messages": [
        {
          "uuid": "03db5651-cb61-4bdf-9ef0-89561f7c9c53",
          "content": "Hello, how are you?",
          "role": "user",
          "createdAt": "2024-09-24T09:09:55.66709+00:00",
          "source": "web",
          "replicaUUID": "f0e4c2f7-ae27-4b35-89bf-7cf729a73687"
        },
        {
          "uuid": "04ea3f1b-df72-4c98-a8f1-2ef820b5c94d",
          "content": "I'm doing well, thank you for asking!",
          "role": "assistant",
          "createdAt": "2024-09-24T09:10:15.33421+00:00",
          "source": "web",
          "replicaUUID": "f0e4c2f7-ae27-4b35-89bf-7cf729a73687"
        }
      ]
    },
    {
      "type": "placeholder",
      "count": 15
    }
  ],
  "count": 2
}
Navigation
Get the next page (older mentions):

# Use the UUID of the last message from the previous response
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/mentions?limit=20&beforeUUID=03db5651-cb61-4bdf-9ef0-89561f7c9c53" \
  -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
  -H "X-API-Version: $API_VERSION" \
  -H "Content-Type: application/json"
Get newer mentions:

# Use the UUID of the first message from the current page
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/mentions?limit=20&afterUUID=ec46b4db-3f0d-4392-b0f5-9fe327922e8a" \
  -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
  -H "X-API-Version: $API_VERSION" \
  -H "Content-Type: application/json"
Implementation pattern
async function loadNextPage(lastMessageUUID) {
  const response = await fetch(
    `/mentions?limit=20&beforeUUID=${lastMessageUUID}`
  );
  return response.json();
}

async function loadPreviousPage(firstMessageUUID) {
  const response = await fetch(
    `/mentions?limit=20&afterUUID=${firstMessageUUID}`
  );
  return response.json();
}

// Usage
const firstPage = await fetch('/mentions?limit=20');
const data = await firstPage.json();

// Get the last message UUID for next page
const lastMessage = data.items
  .filter(item => item.type === 'mention')
  .flatMap(mention => mention.messages)
  .pop();

if (lastMessage) {
  const nextPage = await loadNextPage(lastMessage.uuid);
}
Placeholder expansion
Expand a placeholder chronologically before a known message UUID:

# Use the UUID of the first message after the placeholder
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/messages?limit=20&beforeUUID=03db5651-cb61-4bdf-9ef0-89561f7c9c53" \
  -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
  -H "X-API-Version: $API_VERSION" \
  -H "Content-Type: application/json"
Expand a placeholder chronologically after a known message UUID:

# Use the UUID of the last message before the placeholder
curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/conversations/{conversationUUID}/mentions?limit=20&afterUUID=ec46b4db-3f0d-4392-b0f5-9fe327922e8a" \
  -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
  -H "X-API-Version: $API_VERSION" \
  -H "Content-Type: application/json"
Implementation pattern
async function expandPlaceholderBefore(firstMessageUUID) {
  const response = await fetch(
    `/messages?limit=20&afterUUID=${firstMessageUUID}`
  );
  return response.json();
}

async function expandPlaceholderAfter(lastMessageUUID) {
  const response = await fetch(
    `/messages?limit=20&afterUUID=${lastMessageUUID}`
  );
  return response.json();
}

// Usage
const mentions = await fetch('/mentions?limit=20');
const { items } = await mentions.json();

const placeholders = items.reduce((acc, item, ix, array) => {
  if (item.type === 'placeholder') {
    const mentionBefore = array[ix - 1]
    const mentionAfter = array[ix + 1]

    const firstMessageBeforePlaceholder = mentionBefore?.messages.at(-1).uuid
    const firstMessageAfterPlaceholder = mentionAfter?.messages.at(-1).uuid

    acc.push({
      ...item,
      firstMessageBeforePlaceholder,
      firstMessageAfterPlaceholder
    })
  }
  return acc;
}, [])

// Expand the most recent placeholder
const messages = await fetch(`/messages?afterUUID=${placeholders.at(-1).firstMessageBeforePlaceholder}`)

Understanding message types
Mention items
Mentions represent groups of messages where an interaction with the replica occurred:

type: Always "mention"
messages: Message items that are part of this mention
Message items
Messages represent actual conversation content with full details:

uuid: Unique identifier for cursor navigation
content: The message text
role: Either "user" or "assistant"
createdAt: Timestamp when the message was created
source: Where the message originated (web, telegram, discord, etc.)
replicaUUID: The replica involved in this conversation
Placeholder items
Placeholders represent collapsed groups of messages to improve navigation:

type: Always "placeholder"
count: Number of messages represented by this placeholder
Placeholders typically represent stretches of user-only messages between assistant interactions, allowing you to focus on the most relevant parts of long conversations.

Best practices
Performance
Choose appropriate limits:

10-50 items for UI lists
Up to 100 for data processing
Cache responses when possible:

Cursor positions are stable and cache-friendly
Message content rarely changes once created
Error handling
// Handle invalid cursors
try {
  const response = await fetch(`/mentions?beforeUUID=${uuid}`);
  if (response.status === 400) {
    // UUID doesn't exist in this conversation
    // Fall back to loading from the beginning
    return fetch('/mentions?limit=20');
  }
} catch (error) {
  console.error('Conversation pagination error:', error);
}
UI considerations
Loading states: Always show loading indicators during pagination requests
Empty states: Handle conversations with no assistant interactions
Error states: Provide retry mechanisms for failed requests
Real-time updates: Consider how new messages affect cursor positions
Conversation analytics
The Sensay API provides analytics endpoints that offer insights into conversation patterns and usage across different communication channels for your replicas.

Conversation Analytics overview
The Conversation Analytics endpoints help you understand how your replicas are being used. They provide aggregated data about conversation volumes across conversation sources, and over time.

Historical conversation analytics
The historical analytics endpoint provides cumulative conversation count data over the last 30 days, showing how conversation volume grows over time for your replica.

Basic usage
Get historical conversation data:

curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/analytics/conversations/historical" \
  -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
  -H "X-API-Version: $API_VERSION" \
  -H "Content-Type: application/json"
Response:

{
  success: true,
  items: [
    { "date": "2025-05-01", "cumulativeConversations": 100 },
    { "date": "2025-05-02", "cumulativeConversations": 103 },
    { "date": "2025-05-03", "cumulativeConversations": 108 },
    { "date": "2025-05-04", "cumulativeConversations": 115 }
  ]
}
Understanding historical data
Cumulative counts: Each day shows the total number of conversations created up to that date
30-day window: Always returns exactly 30 data points for the last 30 days
Historical inclusion: Conversations from before the 30-day period are included in the cumulative totals
Date format: Dates are returned in YYYY-MM-DD format in ascending chronological order
Aggregation boundaries: All date boundaries are based on UTC midnight
Implementation pattern
async function getHistoricalData(replicaUUID) {
  const response = await fetch(
    `/v1/replicas/${replicaUUID}/analytics/conversations/historical`,
    {
      headers: {
        'X-ORGANIZATION-SECRET': process.env.ORGANIZATION_SECRET,
        'X-API-Version': '2025-03-25',
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Analytics request failed: ${response.status}`);
  }

  return response.json();
}

// Usage
const data = await getHistoricalData('f0e4c2f7-ae27-4b35-89bf-7cf729a73687');

// Calculate daily growth
const dailyGrowth = data.slice(1).map((day, index) => ({
  date: day.date,
  newConversations: day.cumulativeConversations - data[index].cumulativeConversations
}));
Source analytics
The source analytics endpoint shows how conversations are distributed across different communication channels as of today, helping you understand which platforms your replica is most active on.

Basic usage
Get conversation source distribution:

curl -X GET "https://api.sensay.io/v1/replicas/{replicaUUID}/analytics/conversations/sources" \
  -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
  -H "X-API-Version: $API_VERSION" \
  -H "Content-Type: application/json"
Response:

{
  "success": true,
  "items": [
    { "source": "telegram", "conversations": 245 },
    { "source": "discord", "conversations": 123 },
    { "source": "web", "conversations": 89 },
    { "source": "embed", "conversations": 34 }
  ]
}
Available sources
telegram: Conversations from Telegram bot interactions
discord: Conversations from Discord bot interactions
web: Conversations from the web interface (sensay.io)
embed: Conversations from embedded widgets on websites
Understanding source data
Active sources only: Only communication channels with at least one conversation are included
Total conversations: Each source shows the total number of conversations initiated from that platform
Empty results: Replicas with no conversations return an empty array
Implementation pattern
async function getSourceAnalytics(replicaUUID) {
  const response = await fetch(
    `/v1/replicas/${replicaUUID}/analytics/conversations/sources`,
    {
      headers: {
        'X-ORGANIZATION-SECRET': process.env.ORGANIZATION_SECRET,
        'X-API-Version': '2025-03-25',
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Analytics request failed: ${response.status}`);
  }

  return response.json();
}

// Usage
const { items: sources } = await getSourceAnalytics('f0e4c2f7-ae27-4b35-89bf-7cf729a73687');

// Calculate percentages
const totalConversations = sources.reduce((sum, source) => sum + source.conversations, 0);
const sourcePercentages = sources.map(source => ({
  ...source,
  percentage: ((source.conversations / totalConversations) * 100).toFixed(1)
}));
Analytics Best practices
Performance considerations
Cache analytics data: Analytics queries can be resource-intensive, so cache results when possible
Rate limiting: Be mindful of API rate limits when requesting analytics for multiple replicas
Batch processing: When analyzing multiple replicas, consider implementing batch processing with delays
Error handling
async function safeAnalyticsRequest(endpoint, replicaUUID) {
  try {
    const response = await fetch(`/v1/replicas/${replicaUUID}/analytics/${endpoint}`);

    if (response.status === 404) {
      // Replica doesn't exist or no access
      return null;
    }

    if (response.status === 403) {
      // Insufficient permissions
      throw new Error('Access denied to replica analytics');
    }

    if (!response.ok) {
      throw new Error(`Analytics request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Analytics request error:', error);
    throw error;
  }
}
Data visualization
Historical data works well with line charts to show conversation growth trends:

// Prepare data for chart libraries
function prepareHistoricalChart(data) {
  return {
    labels: data.map(d => d.date),
    datasets: [{
      label: 'Cumulative Conversations',
      data: data.map(d => d.cumulativeConversations),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
}
Source data works well with pie charts or bar charts:

// Prepare data for source distribution charts  
function prepareSourceChart(data) {
  return {
    labels: data.map(d => d.source),
    datasets: [{
      label: 'Conversations by Source',
      data: data.map(d => d.conversations),
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)', 
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)'
      ]
    }]
  };
}
Limitations
Experimental status: These endpoints are currently in experimental phase and may change
Limited timeframe: Historical data is limited to the last 30 days
Aggregate data only: Analytics provide summary statistics, not individual conversation details
Access control: Analytics are subject to the same replica access permissions as other endpoints
In-depth: Training
This documentation explains how to train your replicas using the Sensay API. Training is essential for creating personalized replicas that can provide accurate and relevant responses based on your specific content.

What is a knowledge base?
A knowledge base is a collection of information that your replica uses to answer questions. It's the foundation of your replica's ability to provide accurate and contextually relevant responses. All training in Sensay relies on knowledge base entries.

Knowledge base workflow
When training a replica, each knowledge base entry goes through three stages:

Raw text stage: The initial, unprocessed content you provide (such as documents, articles, or custom text). This is the information you want your replica to learn from.
Processed text stage: The system optimizes your content for better understanding and retrieval.
Vector stage: The processed content is converted into a mathematical representation (vectors) that allows the replica to quickly find and retrieve relevant information when answering questions.
Adding content to the knowledge base
There are two methods to add content to your replica's knowledge base:

Method 1: Adding text content
Create a knowledge base entry
curl -X POST https://api.sensay.io/v1/replicas/$REPLICA_UUID/training \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "Content-Type: application/json" \
 -d '{}'
Example response:

{
  "success": true,
  "knowledgeBaseID": 12345
}
This creates a new empty knowledge base entry. The response includes a knowledgeBaseID that you'll need for the next step.

Add text to the knowledge base entry
curl -X PUT https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/$KNOWLEDGE_BASE_ID \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "Content-Type: application/json" \
 -d '{
   "rawText": "Your training text content goes here. This can be any text you want your replica to learn from, such as product information, company policies, or specialized knowledge."
 }'


After adding text, the system automatically processes it and makes it available for your replica to use when answering questions.

Method 2: Uploading text-based files
Get a signed URL for file upload
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/files/upload?filename=your_file.pdf \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "Content-Type: application/json"
Example response:

{
  "success": true,
  "signedURL": "https://storage.googleapis.com/...",
  "knowledgeBaseID": 12345
}
This prepares the system for your file upload and returns a special URL where you can upload your file, along with the knowledge base ID for tracking. Files up to 50MB are supported.

Upload the file to the signed URL
curl -X PUT $SIGNED_URL \
 -H "Content-Type: application/octet-stream" \
 --data-binary @/path/to/your/file.pdf


After uploading, the system automatically extracts text from your file, processes it, and makes it available for your replica to use.

Managing knowledge base entries
List all knowledge base entries
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/training \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "Content-Type: application/json"
Get a specific knowledge base entry
curl -X GET https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/$KNOWLEDGE_BASE_ID \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "Content-Type: application/json"
Example response:

{
  "success": true,
  "id": 12345,
  "replica_uuid": "12345678-1234-1234-1234-123456789abc",
  "type": "text",
  "filename": null,
  "status": "READY",
  "raw_text": "Your training text content...",
  "processed_text": "Optimized version of your content...",
  "created_at": "2025-04-15T08:11:00.093761+00:00",
  "updated_at": "2025-04-15T08:11:05.299349+00:00",
  "title": null,
  "description": null
}
Delete a knowledge base entry
curl -X DELETE https://api.sensay.io/v1/replicas/$REPLICA_UUID/training/$KNOWLEDGE_BASE_ID \
 -H "X-ORGANIZATION-SECRET: $ORGANIZATION_SECRET" \
 -H "Content-Type: application/json"
Example response:

{
  "success": true
}
Understanding knowledge base status values
The status field in a knowledge base entry indicates its current processing state:

BLANK: Initial state for a newly created text entry
AWAITING_UPLOAD: Initial state for a file entry before upload
SUPABASE_ONLY: File has been uploaded but not yet processed
PROCESSING: Entry is being processed
READY: Entry has been fully processed and is available for retrieval
SYNC_ERROR: An error occurred during synchronization
ERR_FILE_PROCESSING: An error occurred during file processing
ERR_TEXT_PROCESSING: An error occurred during text processing
ERR_TEXT_TO_VECTOR: An error occurred during vector conversion


If you encounter any error states, you may need to delete the entry and try again.

Tutorial: Next.js
Building a chat application with Sensay API in Next.js
This tutorial will guide you through building a modern chat application using Sensay API with Next.js and TypeScript. You'll learn how to integrate the API, handle authentication, manage users and replicas, and implement a fully functional chat interface.

Demo
How to build a Sensay API in a Next.js app

Find the source code at https://github.com/sensay-io/chat-client-sample

You can see a deployed version of the tutorial application at https://sensay-api-chat-tutorial-sensay.vercel.app/

Prerequisites
Before you begin, make sure you have:

Node.js 18+ installed (we recommend using fnm for version management)
A Sensay API key (either an invitation code or an active API key)
Basic knowledge of React, TypeScript, and Next.js
Git installed to clone the sample repository


If you don't have an API key yet, you can request one by filling out the form at Request API Key or redeem an invitation code if you have one.

Getting started
Clone the sample repository
Start by cloning the sample repository which contains all the necessary code to run a fully functional chat application:

git clone https://github.com/sensay-io/chat-client-sample.git
cd chat-client-sample
Install dependencies
Once you've cloned the repository, install the required dependencies:

npm install
Set up your environment
You can set up your environment in two ways:

Option 1: Using .env.local (Recommended for development)
Create a .env.local file in the root directory with your API key:

NEXT_PUBLIC_SENSAY_API_KEY=your_api_key_here
Option 2: In-app configuration
Alternatively, you can paste your API key directly in the application interface when prompted.

Run the application
Start the development server:

npm run dev
This will start the application on http://localhost:3000. Open this URL in your browser to access the chat application.

Understanding the application architecture
The sample application demonstrates a complete integration with Sensay API, handling:

Organization authentication
User creation and management
Replica creation and retrieval
Chat functionality
Key components
SDK Generation: The application uses openapi-typescript-codegen to generate a fully typed client from the Sensay API OpenAPI specification.
Authentication Flow: Demonstrates both organization-level and user-level authentication.
Chat Interface: A responsive UI built with React and Tailwind CSS.
Application initialization flow
When you first start the application, it performs the following steps:

Initializes a client using your provided API key
Checks if a sample user exists, creating one if necessary
Checks for existing replicas, creating a default one if none exists
Sets up the authenticated chat session
This flow mirrors the steps you would typically take when integrating Sensay API into your own applications.

Key implementation patterns
Let's examine the core patterns used in the application that you can adapt for your own projects.

Client initialization
The application initializes the Sensay client in two different ways:

// Organization-level authentication (admin access)
const organizationClient = new Client({
  BASE: 'https://api.sensay.io',
  HEADERS: {
    'X-ORGANIZATION-SECRET': apiKey,
    'Content-Type': 'application/json',
  },
});

// User-level authentication
const userClient = new Client({
  BASE: 'https://api.sensay.io',
  HEADERS: {
    'X-ORGANIZATION-SECRET': apiKey,
    'X-USER-ID': userId,
    'Content-Type': 'application/json',
  },
});
User management
The application demonstrates how to create users and check if they exist:

// Check if user exists
try {
  const user = await organizationClient.users.getUsersGet({
    id: userId,
  });
  console.log('User exists:', user);
  return user;
} catch (error) {
  if (error.status === 404) {
    // Create user if not found
    const newUser = await organizationClient.users.createUsersPost({
      id: userId,
    });
    console.log('Created new user:', newUser);
    return newUser;
  }
  throw error;
}
Replica management
Similarly, the application shows how to list and create replicas:

// List replicas for the user
const replicas = await userClient.replicas.listReplicasGet();

if (replicas.items.length === 0) {
  // Create a new replica if none exists
  const newReplica = await userClient.replicas.createReplicaPost({
    name: `Sample Replica ${Date.now()}`,
    shortDescription: 'A helpful assistant for demonstration purposes',
    greeting: 'Hello! I am a sample replica. How can I help you today?',
    ownerID: userId,
    private: false,
    slug: `sample-replica-${Date.now()}`,
    llm: {
      provider: 'openai',
      model: 'gpt-4o',
    },
  });
  return newReplica.uuid;
}

// Use the first available replica
return replicas.items[0].uuid;
Chat interaction
The chat completion functionality demonstrates how to send messages and receive responses:

// Send a chat message and get a response
const response = await userClient.replicaChatCompletions.createChatCompletionPost({
  replicaUuid: replicaId,
  content: message,
});

if (response.success) {
  // Process and display the response
  setMessages((prev) => [
    ...prev,
    { role: 'assistant', content: response.content },
  ]);
}
Regenerating the SDK
One of the key features of this integration approach is the ability to quickly adapt to API changes by regenerating the SDK. The Sensay API evolves frequently, and regenerating your SDK ensures you always have access to the latest features.

To regenerate the SDK:

npm run generate-sdk
This script fetches the latest OpenAPI specification and generates updated TypeScript client code in the src/sdk directory.



We recommend regenerating your SDK regularly to stay current with the API. The script uses openapi-typescript-codegen, which provides type-safe access to all endpoints.

Troubleshooting common issues
Authentication errors
If you encounter authentication errors:

Verify your API key is correct and not expired
Check that you're including the proper headers for your requests
Ensure you're using the correct user ID when authenticating as a user
"User not found" errors
This typically means the user ID you're using doesn't exist in your organization:

Verify the user has been created
Check that you're using the correct organization API key
Ensure you're not mixing user IDs between different organizations
SDK type errors
If you encounter TypeScript errors after regenerating the SDK:

Make sure your code is updated to match any breaking changes in the API
Check the Versioning documentation for information about API changes
Join the Sensay API Telegram Channel for announcements about breaking changes
Next steps
Now that you have a working chat application, consider:

Customizing the UI: Adapt the interface to match your brand and requirements
Adding Training: Use the Training API to make your replicas more knowledgeable
Implementing Additional Features: Explore features like voice integration or multiple replica support
Deploying Your Application: Deploy to services like Vercel, Netlify, or your own infrastructure
Additional resources
