import { MongodbatlasProviderConfig } from "@mycompany/mongo"
import { App } from "cdktf"
import { DataStack } from "./data"
import { DnsStack } from "./dns"


export interface EnvConfig {
  data: {
    provider: MongodbatlasProviderConfig
    project: {
      orgId: string
    }
  }
}

const env: EnvConfig = {
  data: {
    provider: {
      publicKey: process.env.ATLAS_PUBLIC_KEY || '',
      privateKey: process.env.ATLAS_PRIVATE_KEY || '',
    },
    project: {
      orgId: process.env.ATLAS_ORGANIZATION_ID || '',
    },
  }
}

const app = new App()
const dataStackNamePrefix = 'dev'

new DataStack(app, `${dataStackNamePrefix}-data`, {
  provider: {
    publicKey: env.data.provider.publicKey,
    privateKey: env.data.provider.privateKey,
  },
  project: {
    orgId: env.data.project.orgId,
    name: `${dataStackNamePrefix}`,
  },
  cluster: {
    name: `${dataStackNamePrefix}`,
    clusterType: 'REPLICASET',
    replicationSpecs: [{
      regionConfigs: [{
        electableSpecs: {
          instanceSize: 'M2', // M0 is not supported by the Terraform adapter or cluster v5.0
          nodeCount: 3,
        },
        regionName: 'US_EAST_1',
        priority: 1, // 0 for read-only
        providerName: 'TENANT', // because M2 is cheap
        backingProviderName: 'AWS',
      }]
    }]
  },
})

new DnsStack(app, `${dataStackNamePrefix}-dns`, {
  region: "us-east-1",
  tags: {},
  dnsName: "test.weirdo.com",
})

app.synth()
