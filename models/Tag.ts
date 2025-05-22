import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Tag model for project categorization.
 * @property name - Unique tag name
 * @property color - Optional color (hex or CSS string)
 */
export interface ITag extends Document {
  name: string;
  color?: string | null;
}

const TagSchema: Schema<ITag> = new Schema<ITag>({
  name: { type: String, required: true, unique: true, index: true },
  color: { type: String, default: null },
});

const Tag: Model<ITag> =
  mongoose.models.Tag || mongoose.model<ITag>("Tag", TagSchema);
export default Tag;
