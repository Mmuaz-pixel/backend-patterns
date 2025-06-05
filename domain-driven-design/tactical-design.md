tactical design is more focused on the technical implementation part - more closer to the code

Bounded context - similar to the concept of sub domains and boundaries
entity - basic unique unit in a application whose attributes can be changed e.g a drone (color can be changed), a order 
value objects - immutable properties of a entity e.g battery level of drone entity
aggregates - clusters of entities for a context. has one root entity and other a refrenced through it. they are used for the purpose of creating transactions 
repositries - files having functions for entities dealing directly with the db
services - provide the functionalities of a entity 
ACL - Anti corruption layer is used for communication of two bounded contexts. This step basically maps the input or output structure of one context to other for consistent object styles like DTOs


** Typical Folder structure ** 

/src
├── /order                       ← Order bounded context
│   ├── /domain
│   │   └── Order.js             ← Domain entity
│   ├── /application
│   │   └── ConfirmOrder.js     ← Use case logic
│   ├── /infrastructure
│   │   └── OrderRepo.js        ← DB adapter (in-memory)
│   └── /events
│       └── (optional)          ← Order-related domain events (none needed here)
│
├── /billing                    ← Billing bounded context
│   ├── /domain
│   │   └── Invoice.js          ← Domain entity
│   ├── /application
│   │   └── GenerateInvoice.js ← Use case logic
│   ├── /infrastructure
│   │   └── InvoiceRepo.js     ← DB adapter (in-memory)
│   ├── /acl
│   │   └── OrderToInvoiceTranslator.js ← Anti-Corruption Layer
│   └── /events
│       └── onOrderConfirmed.js ← Event listener, handles external event
│
├── /shared
│   └── eventBus.js             ← Simple in-memory event bus
│
└── index.js                    ← Entry point: creates order, confirms it



** Flow breakdown ** 

[Client]
  POST /order/confirm { orderId: "order-1" }

    ⬇️

[Controller]
  → orderController.confirm()

    ⬇️

[Application Layer]
  → ConfirmOrder.execute()
  → Publishes "OrderConfirmed" event

    ⬇️

[Billing Context]
  → onOrderConfirmed.js subscribed
  → ACL translates event
  → GenerateInvoice use case runs
