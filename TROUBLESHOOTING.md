# Troubleshooting Guide - Mortgage Application Form

## Common Issues and Solutions

### 1. "Failed to fetch" Error

**Problem**: The form submission fails with a "Failed to fetch" error.

**Causes**:
- Network connectivity issues
- CORS (Cross-Origin Resource Sharing) restrictions
- Webhook endpoint is down or inaccessible
- Firewall blocking the request

**Solutions**:

#### For Development:
The form now automatically uses a local test endpoint in development mode:
- Form data will be logged to the console
- No external webhook calls are made
- You can see the submission data in your browser's developer tools

#### For Production:
1. **Check the webhook URL**: Verify that `https://webhooks-listener-woad.vercel.app/api/webhook/f129713b-67b2-4302-9ca0-b2884e21d682` is accessible
2. **Test the endpoint**: Try accessing the webhook URL directly in your browser
3. **Check CORS settings**: Ensure the webhook endpoint allows requests from your domain
4. **Network connectivity**: Verify your internet connection

### 2. Zip Code Lookup Not Working

**Problem**: City and state are not being populated when entering a zip code.

**Causes**:
- Internet connectivity issues
- API endpoint is down
- Invalid zip code format
- API rate limiting

**Solutions**:
1. **Check internet connection**: Ensure you have a stable internet connection
2. **Verify zip code format**: Enter a valid 5-digit US zip code
3. **Check browser console**: Look for error messages in the developer tools
4. **Test the API**: Try accessing `https://api.zippopotam.us/US/10001` directly in your browser

### 3. Form Validation Errors

**Problem**: Form shows validation errors even with valid data.

**Solutions**:
1. **Check required fields**: Ensure all required fields are filled
2. **Email format**: Use a valid email format (e.g., `test@example.com`)
3. **Phone number**: Enter at least 10 digits
4. **Zip code**: Enter a valid 5-digit zip code
5. **Currency fields**: Enter numeric values only

### 4. hCaptcha Issues

**Problem**: hCaptcha is not loading or working properly.

**Solutions**:
1. **Development mode**: hCaptcha is disabled in development by design
2. **Production setup**: Ensure you have a valid hCaptcha site key
3. **Network issues**: Check if hCaptcha scripts are being blocked
4. **Browser compatibility**: Try a different browser

### 5. Tracking Parameters Not Captured

**Problem**: UTM parameters and tracking data are not being captured.

**Solutions**:
1. **Check localStorage**: Ensure localStorage is enabled in your browser
2. **URL format**: Use proper UTM parameter format:
   ```
   ?utm_source=google&utm_medium=cpc&utm_campaign=test&gclid=test123
   ```
3. **Browser console**: Check for any JavaScript errors
4. **Clear browser data**: Try clearing browser cache and localStorage

## Debug Mode

To enable debug logging, add this to your `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

This will provide additional console logging for troubleshooting.

## Testing the Form

### 1. Development Testing
```bash
npm run dev
```
Visit: `http://localhost:3000/mortgage-application`

The form will:
- Use local test endpoint (`/api/test-submission`)
- Log all form data to console
- Show detailed error messages
- Skip hCaptcha verification

### 2. Production Testing
1. Deploy to production
2. Set environment variables:
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_actual_site_key
   ```
3. Test with real webhook endpoint

### 3. Testing with Tracking Parameters
```
http://localhost:3000/mortgage-application?utm_source=google&utm_medium=cpc&utm_campaign=test&gclid=test123&fbclid=test456
```

## Console Logging

The form now includes comprehensive console logging:

- **Form submission data**: All form fields and tracking data
- **API responses**: Status codes and response data
- **Error details**: Specific error messages and stack traces
- **Zip code lookup**: API calls and responses
- **Tracking data**: Captured UTM parameters and other tracking info

## Common Error Messages

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Failed to fetch" | Network/CORS issue | Check internet connection and webhook accessibility |
| "Zip code lookup failed" | API issue | Check internet connection and zip code format |
| "Security verification required" | hCaptcha not completed | Complete hCaptcha verification |
| "Please fill in all required fields" | Validation error | Complete all required fields |
| "Please enter a valid email address" | Email format error | Use valid email format |

## Getting Help

If you're still experiencing issues:

1. **Check browser console**: Look for error messages and logs
2. **Test in different browser**: Try Chrome, Firefox, or Safari
3. **Check network tab**: Look for failed API requests
4. **Verify environment**: Ensure correct environment variables are set
5. **Contact support**: Provide error messages and console logs

## Performance Tips

1. **Clear browser cache**: Regularly clear browser cache and localStorage
2. **Use stable internet**: Ensure stable internet connection for API calls
3. **Disable browser extensions**: Some extensions may interfere with form functionality
4. **Update browser**: Use the latest version of your browser

---

**Last Updated**: January 2025
**Version**: 1.0.0
