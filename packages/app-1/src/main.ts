import { Construct } from "constructs"
import { App, TerraformStack } from "cdktf"
import * as aws from '@cdktf/provider-aws'

export interface MyStackConfig {
  region: string
  tags: Record<string,string>
}

export class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string, config: MyStackConfig) {
    super(scope, name)

    new aws.provider.AwsProvider(this, "aws", {
      region: config.region,
      defaultTags: {tags: config.tags},
    })

    new aws.route53Zone.Route53Zone(this, "example.com", {
      name: "example.com",
    })
  }
}

const app = new App()
new MyStack(app, "app-1", {
  region: "us-east-1",
  tags: {},
})

app.synth()
