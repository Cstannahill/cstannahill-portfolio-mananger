import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * Technology model for project stack.
 * @property name - Unique technology name
 * @property color - Optional color (hex or CSS string)
 */
export interface ITechnology extends Document {
  name: string;
  color?: string | null;
}

const TechnologySchema: Schema<ITechnology> = new Schema<ITechnology>({
  name: { type: String, required: true, unique: true, index: true },
  color: { type: String, default: null },
});

const Technology: Model<ITechnology> =
  mongoose.models.Technology ||
  mongoose.model<ITechnology>("Technology", TechnologySchema);
export default Technology;
