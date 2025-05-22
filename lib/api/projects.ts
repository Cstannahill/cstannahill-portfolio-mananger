export async function getProjectBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/projects/${slug}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch project: ${res.statusText}`);
  }

  const { data } = await res.json();
  return data;
}
