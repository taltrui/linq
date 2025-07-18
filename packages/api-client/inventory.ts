import { z } from 'zod';

export const TransactionType = z.enum([
  'STOCK_IN',
  'INITIAL_COUNT',
  'RESERVATION',
  'RESERVATION_COMPENSATION',
  'CONSUMPTION',
  'AUDIT_ADJUSTMENT',
]);

export type TransactionType = z.infer<typeof TransactionType>;

export const SupplierSchema = z.object({
  id: z.string(),
  name: z.string(),
  contactInfo: z.string().nullable(),
  companyId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Supplier = z.infer<typeof SupplierSchema>;

export const InventoryItemSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  unitPrice: z.number(),
  companyId: z.string(),
  supplierId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  supplier: SupplierSchema.nullable().optional(),
  physicalQuantity: z.number().optional(),
  reservedQuantity: z.number().optional(),
  availableQuantity: z.number().optional(),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export const InventoryTransactionSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  notes: z.string().nullable(),
  type: TransactionType,
  itemId: z.string(),
  jobId: z.string().nullable(),
  quoteId: z.string().nullable(),
  createdAt: z.string().datetime(),
  item: z.object({
    id: z.string(),
    sku: z.string(),
    name: z.string(),
  }).optional(),
  job: z.object({
    id: z.string(),
    displayId: z.number(),
  }).nullable().optional(),
  quote: z.object({
    id: z.string(),
    quotationNumber: z.number(),
  }).nullable().optional(),
});

export type InventoryTransaction = z.infer<typeof InventoryTransactionSchema>;

export const CreateInventoryItemSchema = z.object({
  sku: z.string().trim().min(1, { message: 'SKU es requerido' }),
  name: z.string().trim().min(1, { message: 'Nombre es requerido' }),
  description: z.string().optional(),
  unitPrice: z.number().min(0, { message: 'El precio debe ser mayor o igual a 0' }),
  supplierId: z.string().optional(),
  initialQuantity: z.number().int().min(0).optional(),
});

export type CreateInventoryItem = z.infer<typeof CreateInventoryItemSchema>;

export const UpdateInventoryItemSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().optional(),
  unitPrice: z.number().min(0).optional(),
  supplierId: z.string().optional(),
});

export type UpdateInventoryItem = z.infer<typeof UpdateInventoryItemSchema>;

export const AdjustStockSchema = z.object({
  quantity: z.number().int(),
  type: TransactionType,
  notes: z.string().optional(),
});

export type AdjustStock = z.infer<typeof AdjustStockSchema>;

export const StockLevelsSchema = z.object({
  physicalQuantity: z.number(),
  reservedQuantity: z.number(),
  availableQuantity: z.number(),
});

export type StockLevels = z.infer<typeof StockLevelsSchema>;

export const CreateSupplierSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nombre es requerido' }),
  contactInfo: z.string().optional(),
});

export type CreateSupplier = z.infer<typeof CreateSupplierSchema>;

export const UpdateSupplierSchema = CreateSupplierSchema.partial();

export type UpdateSupplier = z.infer<typeof UpdateSupplierSchema>;

export const QuoteMaterialSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  unitPriceAtTimeOfQuote: z.number(),
  quotationId: z.string(),
  itemId: z.string(),
  item: InventoryItemSchema.optional(),
});

export type QuoteMaterial = z.infer<typeof QuoteMaterialSchema>;

export const AddMaterialToQuotationSchema = z.object({
  itemId: z.string().min(1, { message: 'Item ID es requerido' }),
  quantity: z.number().int().min(1, { message: 'La cantidad debe ser mayor a 0' }),
});

export type AddMaterialToQuotation = z.infer<typeof AddMaterialToQuotationSchema>;

export const UpdateMaterialQuantitySchema = z.object({
  quantity: z.number().int().min(1, { message: 'La cantidad debe ser mayor a 0' }),
});

export type UpdateMaterialQuantity = z.infer<typeof UpdateMaterialQuantitySchema>;

export const JobMaterialSchema = z.object({
  id: z.string(),
  quantityRequired: z.number(),
  quantityUsed: z.number().nullable(),
  jobId: z.string(),
  itemId: z.string(),
  item: InventoryItemSchema.optional(),
});

export type JobMaterial = z.infer<typeof JobMaterialSchema>;

export const AddMaterialToJobSchema = z.object({
  itemId: z.string().min(1, { message: 'Item ID es requerido' }),
  quantityRequired: z.number().int().min(1, { message: 'La cantidad debe ser mayor a 0' }),
});

export type AddMaterialToJob = z.infer<typeof AddMaterialToJobSchema>;

export const UpdateJobMaterialQuantitySchema = z.object({
  quantityRequired: z.number().int().min(1, { message: 'La cantidad requerida debe ser mayor a 0' }),
  quantityUsed: z.number().int().min(0).optional(),
});

export type UpdateJobMaterialQuantity = z.infer<typeof UpdateJobMaterialQuantitySchema>;

export const inventoryContract = {
  // Inventory Items
  createItem: {
    path: '/inventory/items',
    method: 'POST' as const,
    body: CreateInventoryItemSchema,
    responses: {
      201: InventoryItemSchema,
    },
  },
  
  getItems: {
    path: '/inventory/items',
    method: 'GET' as const,
    responses: {
      200: z.array(InventoryItemSchema),
    },
  },
  
  getItem: {
    path: '/inventory/items/:id',
    method: 'GET' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: InventoryItemSchema.extend({
        transactions: z.array(InventoryTransactionSchema).optional(),
      }),
    },
  },
  
  updateItem: {
    path: '/inventory/items/:id',
    method: 'PATCH' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    body: UpdateInventoryItemSchema,
    responses: {
      200: InventoryItemSchema,
    },
  },
  
  deleteItem: {
    path: '/inventory/items/:id',
    method: 'DELETE' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.object({ message: z.string() }),
    },
  },
  
  adjustStock: {
    path: '/inventory/items/:id/adjust-stock',
    method: 'POST' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    body: AdjustStockSchema,
    responses: {
      201: InventoryTransactionSchema,
    },
  },
  
  getStockLevels: {
    path: '/inventory/items/:id/stock-levels',
    method: 'GET' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: StockLevelsSchema,
    },
  },

  // Suppliers
  createSupplier: {
    path: '/suppliers',
    method: 'POST' as const,
    body: CreateSupplierSchema,
    responses: {
      201: SupplierSchema,
    },
  },
  
  getSuppliers: {
    path: '/suppliers',
    method: 'GET' as const,
    query: z.object({
      search: z.string().optional(),
    }).optional(),
    responses: {
      200: z.array(SupplierSchema.extend({
        _count: z.object({
          items: z.number(),
        }).optional(),
      })),
    },
  },
  
  getSupplier: {
    path: '/suppliers/:id',
    method: 'GET' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: SupplierSchema.extend({
        items: z.array(z.object({
          id: z.string(),
          sku: z.string(),
          name: z.string(),
          unitPrice: z.number(),
          createdAt: z.string().datetime(),
        })).optional(),
      }),
    },
  },
  
  updateSupplier: {
    path: '/suppliers/:id',
    method: 'PATCH' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    body: UpdateSupplierSchema,
    responses: {
      200: SupplierSchema,
    },
  },
  
  deleteSupplier: {
    path: '/suppliers/:id',
    method: 'DELETE' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.object({ message: z.string() }),
    },
  },

  // Quotation Materials
  getQuotationMaterials: {
    path: '/quotations/:id/materials',
    method: 'GET' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.array(QuoteMaterialSchema),
    },
  },

  addMaterialToQuotation: {
    path: '/quotations/:id/materials',
    method: 'POST' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    body: AddMaterialToQuotationSchema,
    responses: {
      201: z.object({
        quoteMaterial: QuoteMaterialSchema,
        stockWarning: z.object({
          message: z.string(),
          availableQuantity: z.number(),
          requestedQuantity: z.number(),
        }).nullable(),
      }),
    },
  },

  updateMaterialQuantity: {
    path: '/quotations/:id/materials/:itemId',
    method: 'PATCH' as const,
    pathParams: z.object({
      id: z.string(),
      itemId: z.string(),
    }),
    body: UpdateMaterialQuantitySchema,
    responses: {
      200: z.object({
        quoteMaterial: QuoteMaterialSchema,
        stockWarning: z.object({
          message: z.string(),
          availableQuantity: z.number(),
          requestedQuantity: z.number(),
        }).nullable(),
      }),
    },
  },

  removeMaterialFromQuotation: {
    path: '/quotations/:id/materials/:itemId',
    method: 'DELETE' as const,
    pathParams: z.object({
      id: z.string(),
      itemId: z.string(),
    }),
    responses: {
      200: z.object({ message: z.string() }),
    },
  },

  // Job Materials
  getJobMaterials: {
    path: '/jobs/:id/materials',
    method: 'GET' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: z.array(JobMaterialSchema),
    },
  },

  addMaterialToJob: {
    path: '/jobs/:id/materials',
    method: 'POST' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    body: AddMaterialToJobSchema,
    responses: {
      201: JobMaterialSchema,
    },
  },

  updateJobMaterialQuantity: {
    path: '/jobs/:id/materials/:itemId',
    method: 'PATCH' as const,
    pathParams: z.object({
      id: z.string(),
      itemId: z.string(),
    }),
    body: UpdateJobMaterialQuantitySchema,
    responses: {
      200: JobMaterialSchema,
    },
  },

  removeMaterialFromJob: {
    path: '/jobs/:id/materials/:itemId',
    method: 'DELETE' as const,
    pathParams: z.object({
      id: z.string(),
      itemId: z.string(),
    }),
    responses: {
      200: z.object({ message: z.string() }),
    },
  },

  copyMaterialsFromQuotation: {
    path: '/jobs/:id/copy-materials-from-quotation',
    method: 'POST' as const,
    pathParams: z.object({
      id: z.string(),
    }),
    body: z.object({
      quotationId: z.string(),
    }),
    responses: {
      201: z.object({ count: z.number() }),
    },
  },
};