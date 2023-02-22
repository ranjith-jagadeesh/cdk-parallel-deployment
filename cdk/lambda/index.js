exports.handler = async function(event) {
    console.log("request:", JSON.stringify(event));
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: `Hello, You've successfully deployed the CDK getting started pack\n`
    };
  };