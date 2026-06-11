output "domain_name" {
  description = "CloudFront distribution domain"
  value       = aws_cloudfront_distribution.cdn.domain_name
}
