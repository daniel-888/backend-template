import { Schema, model, Document } from 'mongoose';

// Query type definition
export interface IQuery extends Document {
  addresses: [
    {
      ip: string
    }
  ];
  client_ip: string;
  created_at: number;
  domain: string;
}

const QuerySchema: Schema = new Schema({
  addresses: [
    {
      ip: {
        type: String
      }
    }
  ],
  client_ip: {
    type: String,
    required: true
  },
  created_at: {
    type: Number,
    default: Date.now()
  },
  domain: {
    type: String,
    required: true
  }
})

export default model<IQuery>("query", QuerySchema);

