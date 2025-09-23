# Image Migration Guide

This guide explains how to make your images permanent and avoid S3 URL expiration issues.

## 🚨 Current Problem

Your images are using Notion's temporary S3 URLs that expire after 1 hour. This causes images to show as "Image not available" after the URLs expire.

## 🔧 Solutions

### Option 1: Local Image Storage (Recommended)

**Pros:**
- ✅ Complete control over images
- ✅ No external dependencies
- ✅ Fast loading (served from your domain)
- ✅ No ongoing costs

**Cons:**
- ❌ Increases repository size
- ❌ Need to manage image storage

**Setup:**
```bash
# Run the migration script
npm run migrate-images-local
```

This will:
1. Download all images from Notion URLs
2. Store them in `public/images/notion/`
3. Update all content to use local URLs
4. Process both guides and blog posts

### Option 2: Cloudinary Integration

**Pros:**
- ✅ Automatic image optimization
- ✅ CDN delivery
- ✅ Image transformations
- ✅ No repository size increase

**Cons:**
- ❌ External dependency
- ❌ Monthly costs
- ❌ Need Cloudinary account

**Setup:**
1. Create a Cloudinary account
2. Add environment variables:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Install Cloudinary:
   ```bash
   npm install cloudinary
   ```
4. Run migration:
   ```bash
   npm run migrate-images-cloudinary
   ```

### Option 3: Enhanced Notion Sync

**Pros:**
- ✅ Integrates with existing workflow
- ✅ Handles images during sync
- ✅ Can combine with other solutions

**Cons:**
- ❌ Still depends on Notion URLs
- ❌ More complex setup

## 🚀 Quick Start (Local Storage)

1. **Run the migration:**
   ```bash
   npm run migrate-images-local
   ```

2. **Verify images are working:**
   - Check `public/images/notion/` folder
   - Visit a guides page to see images loading

3. **Update your sync process:**
   - Modify your Notion sync to use the enhanced image processing
   - Or run the migration script regularly

## 🔄 Ongoing Maintenance

### For Local Storage:
- Run `npm run migrate-images-local` after each Notion sync
- Monitor `public/images/notion/` folder size
- Consider adding to `.gitignore` if repository gets too large

### For Cloudinary:
- Images are automatically managed
- Monitor your Cloudinary usage
- Set up webhooks for automatic processing

## 🛠️ Advanced Configuration

### Custom Image Processing

You can modify the scripts to:
- Resize images automatically
- Convert to WebP format
- Add watermarks
- Compress images

### Environment Variables

Add to your `.env` file:
```env
# For local storage
IMAGES_BASE_URL=/images/notion

# For Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=capitaleme
```

## 📊 Comparison

| Feature | Local Storage | Cloudinary | Current (S3) |
|---------|---------------|------------|--------------|
| **Permanent** | ✅ Yes | ✅ Yes | ❌ No (1 hour) |
| **Speed** | ✅ Fast | ✅ Very Fast | ✅ Fast |
| **Cost** | ✅ Free | 💰 $5-20/month | ✅ Free |
| **Control** | ✅ Full | ⚠️ Limited | ❌ None |
| **Setup** | 🟢 Easy | 🟡 Medium | 🟢 Easy |

## 🎯 Recommendation

**Start with Local Storage** (Option 1) because:
1. It's the simplest solution
2. No external dependencies
3. Complete control
4. Can migrate to Cloudinary later if needed

## 🔧 Troubleshooting

### Images not downloading:
- Check internet connection
- Verify Notion URLs are accessible
- Check file permissions

### Images not displaying:
- Verify `public/images/notion/` exists
- Check image URLs in content
- Clear browser cache

### Large repository size:
- Add `public/images/notion/` to `.gitignore`
- Use Git LFS for large files
- Consider Cloudinary migration

## 📞 Support

If you encounter issues:
1. Check the console logs
2. Verify environment variables
3. Test with a single image first
4. Check file permissions

The migration scripts include detailed logging to help debug any issues.
