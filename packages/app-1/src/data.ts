import { Construct } from "constructs"
import { TerraformOutput, TerraformStack } from "cdktf"

import {
  MongodbatlasProvider, MongodbatlasProviderConfig,
  Project, ProjectConfig,
  AdvancedCluster, AdvancedClusterConfig,
} from '@mycompany/mongo'

export interface DataStackConfig {
  provider: MongodbatlasProviderConfig
  project: ProjectConfig
  cluster: Omit<AdvancedClusterConfig, "projectId">
}

export class DataStack extends TerraformStack {
  projectId: TerraformOutput
  clusterId: TerraformOutput

  constructor(scope: Construct, name: string, config: DataStackConfig) {
    super(scope, name)

    new MongodbatlasProvider(this, "mongo", config.provider)

    const project = new Project(this, "project", config.project)

    const cluster = new AdvancedCluster(this, "cluster", {
      ...config.cluster,
      projectId: project.id,
    })

    // output
    this.projectId = new TerraformOutput(this, "projectId", {
      value: project.id,
    })

    this.clusterId = new TerraformOutput(this, "clusterId", {
      value: cluster.id,
    })

  }
}
