param(
    [int]$Port = 8000
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = $Port
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$port/"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css" = "text/css; charset=utf-8"
    ".js" = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png" = "image/png"
    ".jpg" = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif" = "image/gif"
    ".ico" = "image/x-icon"
    ".pdf" = "application/pdf"
    ".svg" = "image/svg+xml"
    ".woff" = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf" = "font/ttf"
    ".eot" = "application/vnd.ms-fontobject"
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $path = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart([char]"/"))
    if ([string]::IsNullOrWhiteSpace($path)) {
        $path = "index.html"
    }
    $path = $path.Replace("/", [System.IO.Path]::DirectorySeparatorChar)

    $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $path))
    if (-not $fullPath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        $context.Response.StatusCode = 403
        $context.Response.Close()
        continue
    }

    if ([System.IO.Directory]::Exists($fullPath)) {
        $fullPath = [System.IO.Path]::Combine($fullPath, "index.html")
    }

    if (-not [System.IO.File]::Exists($fullPath)) {
        $context.Response.StatusCode = 404
        $context.Response.Close()
        continue
    }

    $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
    $context.Response.ContentType = $mimeTypes[$extension]
    if (-not $context.Response.ContentType) {
        $context.Response.ContentType = "application/octet-stream"
    }

    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.Close()
}
