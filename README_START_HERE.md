# Mohamed Abdullah — Black & Yellow Portfolio

## Upload to GitHub
1. Extract the ZIP file.
2. Open the extracted `Mohamed_Abdullah_CMS_Portfolio` folder.
3. Upload **everything inside that folder** to your repository `MhdAbdullah98/Mohamed-Abdullah-Portfolio` (including `index.html`, `assets/`, `content/`, and `admin/`). Do not upload only the ZIP.
4. Commit the changes to the `main` branch.

## Publish
1. Sign in to Netlify and choose **Add new project → Import an existing project → GitHub**.
2. Authorize Netlify to access your repository and select `Mohamed-Abdullah-Portfolio`.
3. Use the repository root as the publish directory (often leave the field blank or use `.`). No build command is needed.
4. Deploy. Netlify provides a public `.netlify.app` link.

## Video manager — additional configuration required
The `/admin/` folder contains **Decap CMS**, but admin login is NOT configured yet. Netlify hosting alone does not enable GitHub OAuth login. Configure a compatible GitHub OAuth authentication service and update `admin/config.yml` (`base_url` / `auth_endpoint`), or use a managed compatible provider. Never place OAuth secrets in this public repository. After successful setup, admin edits commit `content/portfolio.json` to GitHub and Netlify redeploys automatically.

## Immediate way to add videos before admin setup
Edit `content/portfolio.json` directly using GitHub's web editor. Example:

```json
{
  "showreel_url": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  "email": "you@example.com",
  "projects": [
    {"title": "Brand Commercial", "description": "Video editing and color grading", "url": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID", "thumbnail": "", "category": "commercial"}
  ]
}
```

Replace examples with your real links. Commit changes; Netlify automatically publishes them after the deploy completes. YouTube unlisted videos are accessible to anyone who has the link or sees the embed. Some Google Drive videos may not embed depending on sharing settings.

## Preview
Open `index.html` for a visual preview. Since browsers may block local `fetch` requests, the video gallery is best tested after publishing or by running a local web server. No actual portfolio videos or email address have been added yet.


## Separate AI Video gallery
Choose category `ai` for AI video projects in the CMS; the AI Videos filter shows only those. Choose the other categories for normal video editing projects. Paste an individual YouTube, Vimeo or public Google Drive file URL and optional thumbnail URL for each project.

Note: the admin login is NOT functional until a compatible GitHub OAuth authentication service is configured. The public website needs hosting (e.g. Netlify) to load the JSON gallery; opening index.html directly from disk may not load videos because browsers restrict local fetch.


## Playing videos inside the website
Each project must use an individual YouTube, Vimeo, or Google Drive file URL, not a Google Drive folder URL. Google Drive file links must be shared as Anyone with the link / Viewer. Videos open in an embedded 16:9 player overlay on the portfolio page, if the host allows embedding. For best reliability use YouTube Unlisted or Vimeo. Set `showreel_url` to an individual video URL to enable the showreel. The video manager requires Decap CMS authentication to be configured separately.
