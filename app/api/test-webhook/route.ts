import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing webhook endpoint accessibility...')
    
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      message: 'Testing webhook connectivity'
    }

    const response = await fetch('https://webhooks-listener-woad.vercel.app/api/webhook/f129713b-67b2-4302-9ca0-b2884e21d682', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    console.log('Webhook test response status:', response.status)
    
    if (response.ok) {
      const responseText = await response.text()
      console.log('Webhook test response:', responseText)
      
      return NextResponse.json({
        success: true,
        message: 'Webhook endpoint is accessible',
        status: response.status,
        response: responseText
      })
    } else {
      const errorText = await response.text()
      console.error('Webhook test failed:', errorText)
      
      return NextResponse.json({
        success: false,
        message: 'Webhook endpoint returned error',
        status: response.status,
        error: errorText
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Webhook test error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Webhook endpoint is not accessible',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
