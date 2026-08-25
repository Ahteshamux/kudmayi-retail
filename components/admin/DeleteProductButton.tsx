"use client";

import { useFormStatus } from "react-dom";
import { deleteProduct } from "@/app/admin/products/actions";

function Button({ name }: { name: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(`Delete "${name}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
      className="u-caps text-muted hover:text-rust px-2 py-1 transition-colors disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteProduct}>
      <input type="hidden" name="id" value={id} />
      <Button name={name} />
    </form>
  );
}
