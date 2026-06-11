variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "opencrochet"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
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
