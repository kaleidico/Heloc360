import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('Received mortgage application data:', JSON.stringify(data, null, 2))
    
    // Submit to the webhook endpoint
    const response = await fetch('https://webhooks-listener-woad.vercel.app/api/webhook/f129713b-67b2-4302-9ca0-b2884e21d682', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    console.log('Webhook response status:', response.status)
    
    if (response.ok) {
      const responseData = await response.text()
      console.log('Webhook response:', responseData)
      
      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully',
        webhookResponse: responseData
      })
    } else {
      const errorText = await response.text()
      console.error('Webhook error:', errorText)
      
      return NextResponse.json({
        success: false,
        message: 'Failed to submit to webhook',
        error: errorText
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error processing mortgage application:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
