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

  async createDocument(query: { databaseId: string; collectionId: string; documentId: string; data: object; extra: { [key:string]: string; } }) {
    return await this.databases.createDocument(query.databaseId, query.collectionId, query.documentId, query.data)
  }

  async read(query: { databaseId: string; collectionId: string; documentId: string; queries: string; extra: { [key:string]: string; } }) {
    let queries
    if (query.queries) {
      try {
        queries = JSON.parse(query.queries)
      } catch(e) {
        throw "Invalid queries - must be a valid array."
      }
    }
    if (query.extra.type === "Documents") {
      if (query.documentId) {
        return await this.databases.getDocument(query.databaseId, query.collectionId, query.documentId)
      }
      return await this.databases.listDocuments(query.databaseId, query.collectionId, queries)
    }
    if (query.extra.type === "Collections") {
      if (query.collectionId) {
        return await this.databases.getCollection(query.databaseId, query.collectionId)
      }
      return await this.databases.listCollections(query.databaseId, queries)
    }
    if (query.databaseId) {
      return await this.databases.get(query.databaseId)
    }
    return await this.databases.list(queries)
  }

  async update(query: { databaseId: string; collectionId: string; name: string; extra: { [key:string]: string; } }) {
    if (query.extra.type === "Collections") {
      return await this.databases.updateCollection(query.databaseId, query.collectionId, query.name)
    }
    return await this.databases.update(query.databaseId, query.name)
  }

  async updateDocument(query: { databaseId: string; collectionId: string; documentId: string; data: object; extra: { [key:string]: string; } }) {
    return await this.databases.updateDocument(query.databaseId, query.collectionId, query.documentId, query.data)
  }

  async delete(query: { databaseId: string; collectionId: string; documentId: string; extra: { [key:string]: string; } }) {
    if (query.extra.type === "Documents") {
      return await this.databases.deleteDocument(query.databaseId, query.collectionId, query.documentId)
    }
    if (query.extra.type === "Collections") {
      return await this.databases.deleteCollection(query.databaseId, query.collectionId)
    }
    return await this.databases.delete(query.databaseId)
  }
}

export default CustomIntegration
