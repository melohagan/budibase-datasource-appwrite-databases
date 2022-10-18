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

  async create(query: { databaseId: string; collectionId: string; name: string; extra: { [key:string]: string; } }) {
    if (query.extra.type === "Collections") {
      return await this.databases.createCollection(query.databaseId, query.collectionId, query.name)
    }
    return await this.databases.create(query.databaseId, query.name)
  }

  async read(query: { databaseId: string; collectionId: string; extra: { [key:string]: string; } }) {
    if (query.extra.type === "Collections") {
      if (query.collectionId) {
        return await this.databases.getCollection(query.databaseId, query.collectionId)
      }
      return await this.databases.listCollections(query.databaseId)
    }
    if (query.databaseId) {
      return await this.databases.get(query.databaseId)
    }
    return await this.databases.list()
  }

  async update(query: { databaseId: string; collectionId: string; name: string; extra: { [key:string]: string; } }) {
    if (query.extra.type === "Collections") {
      return await this.databases.updateCollection(query.databaseId, query.collectionId, query.name)
    }
    return await this.databases.update(query.databaseId, query.name)
  }

  async delete(query: { databaseId: string; collectionId: string; extra: { [key:string]: string; } }) {
    if (query.extra.type === "Collections") {
      return await this.databases.deleteCollection(query.databaseId, query.collectionId)
    }
    return await this.databases.delete(query.databaseId)
  }
}

export default CustomIntegration
