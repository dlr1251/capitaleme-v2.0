# Supabase Image Fix Guide

This guide explains how to fix the expired S3 URL issue in your Notion → Supabase → Astro architecture.

## 🏗️ Current Architecture

```
Notion (with expired S3 URLs) → Supabase → Astro (shows broken images)
```

## 🚨 The Problem

1. **Notion** stores images with temporary S3 URLs (expire in 1 hour)
2. **Your sync process** copies these expired URLs to Supabase
3. **Astro** reads from Supabase and tries to display expired URLs
4. **Result**: Images show as "Image not available"

## 🔧 Solutions

### Option 1: Process Existing Supabase Content (Immediate Fix)

**Run this to fix all existing content:**
```bash
npm run process-supabase-images
```

This will:
1. ✅ Read all content from Supabase
2. ✅ Download images from Notion URLs
3. ✅ Store them in `public/images/notion/`
4. ✅ Update Supabase with permanent local URLs
5. ✅ Fix all existing guides and blog posts

### Option 2: Fix the Notion Sync Process (Long-term)

**Modify your sync process to handle images before storing in Supabase:**

1. **Update your sync script** to use the enhanced image processing
2. **Images will be processed** during the sync, not after
3. **Supabase will store permanent URLs** from the start

### Option 3: Add Image Processing to Your Existing Sync

**Integrate image processing into your current sync workflow:**

```javascript
// In your sync script, after fetching from Notion but before storing in Supabase
const processedContent = await processContentImages(notionContent);
// Then store processedContent in Supabase
```

## 🚀 Quick Start (Recommended)

### Step 1: Fix Existing Content
```bash
npm run process-supabase-images
```

### Step 2: Verify It Worked
- Check `public/images/notion/` folder for downloaded images
- Visit a guides page to see images loading
- Check Supabase to see updated content with local URLs

### Step 3: Update Your Sync Process
- Modify your Notion sync to use enhanced image processing
- Or run the processing script after each sync

## 🔄 Integration with Your Workflow

### Option A: Post-Processing (Easiest)
```bash
# After your normal Notion sync
npm run sync-notion-to-supabase
npm run process-supabase-images
```

### Option B: Integrated Processing (Best)
Modify your sync script to process images during the sync:

```javascript
// In your sync script
import { processContentImages } from './enhanced-notion-sync-with-images.js';

// After fetching content from Notion
const processedContent = await processContentImages(notionContent);

// Store processed content in Supabase
await supabase.from('guides').update({ content: processedContent });
```

## 📁 File Structure

After running the fix:
```
public/
  images/
    notion/
      image_1234567890_abc123.png
      image_1234567891_def456.jpg
      ...
```

## 🔍 What Gets Fixed

### Before:
```markdown
![image](https://prod-files-secure.s3.us-west-2.amazonaws.com/...expired...)
```

### After:
```markdown
![image](/images/notion/image_1234567890_abc123.png)
```

## 🛠️ Advanced Configuration

### Custom Image Processing

You can modify the script to:
- Resize images automatically
- Convert to WebP format
- Add compression
- Generate thumbnails

### Environment Variables

Add to your `.env` file:
```env
# For image processing
IMAGES_BASE_URL=/images/notion
IMAGES_QUALITY=80
IMAGES_MAX_WIDTH=1200
```

## 🔄 Ongoing Maintenance

### After Each Notion Sync:
1. Run your normal sync
2. Run `npm run process-supabase-images`
3. Or integrate image processing into your sync

### Monitoring:
- Check `public/images/notion/` folder size
- Monitor Supabase content for new images
- Verify images are loading on your site

## 🎯 Benefits

✅ **Immediate fix** - All existing images will work
✅ **Permanent solution** - Images never expire again
✅ **Fast loading** - Images served from your domain
✅ **No external dependencies** - Everything stays in your control
✅ **Works with your architecture** - Fits perfectly with Notion → Supabase → Astro

## 🚨 Important Notes

1. **Run the script after each Notion sync** to catch new images
2. **Monitor the `public/images/notion/` folder** for storage space
3. **Test with a few images first** before processing everything
4. **Backup your Supabase data** before running the script

## 🔧 Troubleshooting

### Images not downloading:
- Check internet connection
- Verify Notion URLs are accessible
- Check file permissions

### Images not displaying:
- Verify `public/images/notion/` exists
- Check image URLs in Supabase content
- Clear browser cache

### Script errors:
- Check environment variables
- Verify Supabase connection
- Check file permissions

## 📞 Support

The script includes detailed logging to help debug any issues. Check the console output for specific error messages.
