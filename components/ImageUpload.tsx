"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { compressImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";

export const BUCKET = "product-images";

type Props = {
  /** Existing photo when editing. */
  value: string | null;
  onChange: (url: string | null) => void;
  /** Lets the parent block submit while an upload is in flight. */
  onUploadingChange?: (uploading: boolean) => void;
};

export function ImageUpload({ value, onChange, onUploadingChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revoke the object URL when the preview changes or we unmount.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function setUploadingState(next: boolean) {
    setUploading(next);
    onUploadingChange?.(next);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingState(true);

    try {
      const blob = await compressImage(file);

      // Show the compressed result immediately; upload continues behind it.
      const localUrl = URL.createObjectURL(blob);
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old);
        return localUrl;
      });

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Your session expired. Sign in again.");

      const path = `${user.id}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { contentType: "image/jpeg" });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path);

      onChange(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old);
        return null;
      });
    } finally {
      setUploadingState(false);
      // Reset so picking the same file twice still fires onChange.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function clear() {
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    onChange(null);
    setError(null);
  }

  const shown = preview ?? value;

  return (
    <div className="space-y-3">
      <span className="u-caps text-muted block">Photo</span>

      <div className="border-brass/25 bg-espresso-raised relative aspect-[3/4] w-full max-w-[240px] overflow-hidden border">
        {shown ? (
          preview ? (
            // Local blob preview — plain img, next/image can't optimise it.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shown}
              alt="Selected photo"
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={shown}
              alt="Product photo"
              fill
              sizes="240px"
              className="object-cover"
            />
          )
        ) : (
          <div className="text-muted/60 u-caps flex h-full items-center justify-center text-center">
            No photo yet
          </div>
        )}

        {uploading && (
          <div className="bg-espresso/70 u-caps text-parchment absolute inset-0 flex items-center justify-center">
            Uploading…
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="u-btn-ghost u-caps"
        >
          {shown ? "Replace photo" : "Choose photo"}
        </button>
        {shown && !uploading && (
          <button
            type="button"
            onClick={clear}
            className="u-caps text-muted hover:text-rust px-2 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-rust text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
