output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = module.s3.bucket_name
}

output "ec2_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = module.ec2.public_ip
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain"
  value       = module.cloudfront.domain_name
}
