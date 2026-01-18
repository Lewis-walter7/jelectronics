import "@/lib/dns-patch"; // Apply DNS patch for IPv4
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            // Ideally check for admin session here using cookies
            return { dir: "products" };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata);
            console.log("file url", file.url);
            return { uploadedBy: "admin" };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
