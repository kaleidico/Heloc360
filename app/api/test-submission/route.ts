import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Log the received data
    console.log('Received form submission:', JSON.stringify(data, null, 2))
    
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
