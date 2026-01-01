"use client"

import { useState, useEffect } from "react"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    fetch("/openapi.json")
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error("[v0] Failed to load OpenAPI spec:", err))
  }, [])

  if (!spec) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading API Documentation...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">API Documentation</h1>
          <p className="text-muted-foreground mt-2">Complete REST API reference for Task Management System</p>
        </div>
        <SwaggerUI spec={spec} />
      </div>
    </div>
  )
}
