/** High-priority image hints for the home page — hoisted into document head. */
export function HomePreloads() {
  const preloads = [
    "/images/projects/deskkeeper/icon.png",
    "/images/projects/graduaid.png",
    "/images/about/portrait.png",
  ];

  return (
    <>
      {preloads.map((href) => (
        <link key={href} rel="preload" as="image" href={href} fetchPriority="high" />
      ))}
    </>
  );
}
