## Domain Entities

### Project

Properties:
- id: string (required)
- name: string (required)

Relationships: has many Features

## Sequence Diagram

```mermaid
sequenceDiagram
  participant A as Agent1
  participant B as Agent2
  A->>B: send output
```

## IAM Policies

| Service | Actions | Resource | Effect |
| --- | --- | --- | --- |
| Lambda | lambda:InvokeFunction | arn:aws:lambda:*:*:function:test | Allow |

## AWS Cost Projection

### MVP

| Service | Monthly Cost (USD) |
| --- | --- |
| Lambda | $5.00 |

### Scale

| Service | Monthly Cost (USD) |
| --- | --- |
| Lambda | $50.00 |
