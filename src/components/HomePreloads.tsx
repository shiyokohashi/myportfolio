/** High-priority image hints for the home page — hoisted into document head. */
export function HomePreloads() {
  const preloads = [
    "/images/projects/secretaryat/poster.jpg",
    "/images/projects/deskkeeper/icon.png",
    "/images/projects/aeon/interaction-design.png",
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
