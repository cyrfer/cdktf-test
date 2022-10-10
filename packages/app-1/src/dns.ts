import { Construct } from "constructs"
import { TerraformOutput, TerraformStack } from "cdktf"
import * as aws from '@cdktf/provider-aws'

export interface DnsStackConfig {
  region: string
  tags: Record<string,string>
  dnsName: string
}

export class DnsStack extends TerraformStack {
  hostedZoneId: TerraformOutput

  constructor(scope: Construct, name: string, config: DnsStackConfig) {
    super(scope, name)

    new aws.provider.AwsProvider(this, "aws", {
      region: config.region,
      defaultTags: {tags: config.tags},
    })

    const zone = new aws.route53Zone.Route53Zone(this, config.dnsName, {
      name: config.dnsName,
    })

    this.hostedZoneId = new TerraformOutput(this, "hostedZoneId", {
      value: zone.id,
    })
  }
}
