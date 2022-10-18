import { IntegrationBase } from "@budibase/types"
import { Client, Databases } from "node-appwrite";

class CustomIntegration implements IntegrationBase {
  private readonly client: Client
  private readonly databases: Databases

  constructor(config: { endpoint: string; projectId: string; apiKey: string; }) {
    this.client = new Client()
    this.databases = new Databases(this.client)
    this.client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey)
  }

  async create(query: { databaseId: string; name: string; }) {
    return await this.databases.create(query.databaseId, query.name)
  }

  async read(query: { databaseId: string; extra: { [key:string]: string; } }) {
    if (query.databaseId) {
      return await this.databases.get(query.databaseId)
    }
    return await this.databases.list()
  }

  async update(query: { databaseId: string; name: string; }) {
    return await this.databases.update(query.databaseId, query.name)
  }

  async delete(query: { databaseId: string; extra: { [key:string]: string; } }) {
    return await this.databases.delete(query.databaseId)
  }
}

export default CustomIntegration
