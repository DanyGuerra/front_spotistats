output "bucket_name" {
  description = "Nombre del bucket creado"
  value       = aws_s3_bucket.topstats_bucket.bucket
}

output "cloudfront_url" {
  description = "URL de CloudFront para acceder a la app"
  value       = "https://${aws_cloudfront_distribution.topstats_distribution.domain_name}"
}

