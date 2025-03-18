/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "mastra-sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {

    const openAITokenSecret = new sst.Secret("OpenAIToken");

    const vpc = new sst.aws.Vpc("main-vpc");

    const cluster = new sst.aws.Cluster("main", {
      vpc,
    });

    const mastra = new sst.aws.Service("mastra", {
      link: [openAITokenSecret],
      cluster,
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "4111/http" }],
        public: true
      },
      image: {
        context: "./ai",
        dockerfile: "./ai/Dockerfile"
      },
      dev: {
        directory: "ai",
        command: "npm run dev",
      },
    });

    console.log(mastra.url);
  },
});
