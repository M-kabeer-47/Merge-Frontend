/**
 * Upload a file directly to S3 using XMLHttpRequest for real progress tracking.
 * This is a pure utility function with no React dependencies.
 */
export function uploadToS3(
  uploadUrl: string,
  file: File,
  contentType: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        console.error("S3 upload failed:", xhr.status, xhr.responseText);
        reject(new Error(`S3 upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      console.error("S3 upload network error - check CORS configuration");
      reject(
        new Error(
          "Network error during S3 upload. Check S3 CORS configuration."
        )
      );
    };

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.send(file);
  });
}
