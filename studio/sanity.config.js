import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas/index.js";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "brooklyn_choir_project",
  title: "Brooklyn Choir Project",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website")
          .items([
            S.listItem()
              .title("Homepage")
              .id("siteContent")
              .child(
                S.document()
                  .schemaType("siteContent")
                  .documentId("siteContent")
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
