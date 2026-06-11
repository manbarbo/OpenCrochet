variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "opencrochet"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
}

variable "allowed_origins" {
  description = "Allowed CORS origins"
  type        = string
  default     = "*"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed for SSH"
  type        = string
  default     = "0.0.0.0/0"
}
