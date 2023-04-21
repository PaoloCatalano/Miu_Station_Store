const fs = require("fs");

function addPage(page) {
  const path = page
    .replace("pages", "")
    .replace(".tsx", "")
    .replace(".jsx", "")
    .replace(".js", "")
    .replace(".ts", "");
  const route = path.includes("index") ? "" : path;

  return `  <url>
    <loc>${`${process.env.BASE_URL}${route}`}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`;
}

async function generateSitemap() {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = fs
    .readdirSync("pages")
    .filter((staticPage) => {
      return ![
        "_app.tsx",
        "_document.js",
        "sitemap.xml.js",
        "api",
        "create",
        "user",
        "404.jsx",
        "500.jsx",
        "create.js",
        "user.js",
        "order.js",
        "users.jsx",
        "verify-email.jsx",
        "reset-password.jsx",
        "forgot-password.jsx",
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `/${staticPagePath}`;
      // return `${staticPagePath}`; if use Vercel
    });

  const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${pages.map(addPage).join("\n")}
</urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap);
  console.log("sitemap generated!");
}

generateSitemap();
