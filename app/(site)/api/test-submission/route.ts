import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Received form submission (redacted for prod)')
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      timestamp: new Date().toISOString(),
      data: data
    })
  } catch (error) {
    console.error('Error processing form submission:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing form submission',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
