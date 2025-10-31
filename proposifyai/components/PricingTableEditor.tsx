'use client';

// Pricing Table Editor Component
// Allows editing pricing tables in proposals

import React, { useState } from 'react';
import {
  PricingLineItem,
  PricingTable,
  calculateLineItemTotal,
  calculatePricingTable,
  formatCurrency,
  generateLineItemId,
} from '@/types/pricing';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface PricingTableEditorProps {
  initialData?: Partial<PricingTable>;
  onChange: (data: PricingTable) => void;
  className?: string;
}

export default function PricingTableEditor({
  initialData,
  onChange,
  className = '',
}: PricingTableEditorProps) {
  const [lineItems, setLineItems] = useState<PricingLineItem[]>(
    initialData?.lineItems || [createEmptyLineItem()]
  );
  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [showTax, setShowTax] = useState(initialData?.showTax ?? true);
  const [showDiscount, setShowDiscount] = useState(initialData?.showDiscount ?? false);
  const [taxRate, setTaxRate] = useState(initialData?.taxRate || 0);
  const [discountRate, setDiscountRate] = useState(initialData?.discountRate || 0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    initialData?.discountType || 'percentage'
  );
  const [paymentTerms, setPaymentTerms] = useState(initialData?.paymentTerms || '');
  const [depositRequired, setDepositRequired] = useState(initialData?.depositRequired || 0);
  const [depositType, setDepositType] = useState<'percentage' | 'fixed'>(
    initialData?.depositType || 'percentage'
  );
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Calculate totals
  const calculation = calculatePricingTable({
    id: initialData?.id || 'temp',
    lineItems,
    currency,
    showTax,
    showDiscount,
    taxRate: showTax ? taxRate : undefined,
    discountRate: showDiscount ? discountRate : undefined,
    discountType,
    displayMode: 'simple',
    showOptionalItems: true,
    groupByCategory: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Update parent component whenever data changes
  React.useEffect(() => {
    const pricingTable: PricingTable = {
      id: initialData?.id || generateLineItemId(),
      proposalId: initialData?.proposalId,
      currency,
      lineItems,
      subtotal: calculation.subtotal,
      discountTotal: calculation.discountAmount,
      taxTotal: calculation.taxAmount,
      total: calculation.total,
      showTax,
      showDiscount,
      taxRate: showTax ? taxRate : undefined,
      discountRate: showDiscount ? discountRate : undefined,
      discountType,
      displayMode: 'simple',
      showOptionalItems: true,
      groupByCategory: false,
      paymentTerms,
      depositRequired,
      depositType,
      notes,
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    onChange(pricingTable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineItems, currency, showTax, showDiscount, taxRate, discountRate, discountType, paymentTerms, depositRequired, depositType, notes]);

  const addLineItem = () => {
    setLineItems([...lineItems, createEmptyLineItem()]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, updates: Partial<PricingLineItem>) => {
    setLineItems(lineItems.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  return (
    <div className={`pricing-table-editor bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
          <div className="flex items-center space-x-4">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
            </select>

            {/* Settings Toggles */}
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showDiscount}
                onChange={(e) => setShowDiscount(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              Show Discount
            </label>
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showTax}
                onChange={(e) => setShowTax(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              Show Tax
            </label>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-8"></th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24">
                Quantity
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-32">
                Unit Price
              </th>
              {showDiscount && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-24">
                  Discount %
                </th>
              )}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-32">
                Amount
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lineItems.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-2 py-3">
                  <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                    placeholder="Item description"
                    className="w-full text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                    className="w-full text-sm text-center border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full text-sm text-right border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </td>
                {showDiscount && (
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={item.discount || 0}
                      onChange={(e) => updateLineItem(item.id, { discount: parseFloat(e.target.value) || 0 })}
                      className="w-full text-sm text-right border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </td>
                )}
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  {formatCurrency(calculateLineItemTotal(item), currency)}
                </td>
                <td className="px-2 py-3 text-center">
                  <button
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                    className="text-red-600 hover:text-red-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Line Item Button */}
      <div className="px-6 py-3 border-t border-gray-200">
        <button
          onClick={addLineItem}
          className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Line Item
        </button>
      </div>

      {/* Totals and Settings */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Settings */}
          <div className="space-y-4">
            {showDiscount && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Global Discount
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                    className="flex-1 text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">{currency}</option>
                  </select>
                </div>
              </div>
            )}

            {showTax && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deposit Required
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={depositRequired}
                  onChange={(e) => setDepositRequired(parseFloat(e.target.value) || 0)}
                  className="flex-1 text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
                <select
                  value={depositType}
                  onChange={(e) => setDepositType(e.target.value as 'percentage' | 'fixed')}
                  className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">{currency}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right: Totals */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(calculation.subtotal, currency)}
              </span>
            </div>

            {showDiscount && calculation.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-green-600">
                  -{formatCurrency(calculation.discountAmount, currency)}
                </span>
              </div>
            )}

            {showTax && calculation.taxAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(calculation.taxAmount, currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2">
              <span className="text-gray-900">Total:</span>
              <span className="text-primary-600">
                {formatCurrency(calculation.total, currency)}
              </span>
            </div>

            {depositRequired > 0 && (
              <div className="flex justify-between text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
                <span>Deposit Amount:</span>
                <span className="font-medium">
                  {formatCurrency(
                    depositType === 'percentage'
                      ? (calculation.total * depositRequired) / 100
                      : depositRequired,
                    currency
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Terms */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Terms
          </label>
          <textarea
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            placeholder="e.g., Net 30, Due upon receipt, 50% upfront..."
            rows={2}
            className="w-full text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes about pricing..."
            rows={2}
            className="w-full text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
    </div>
  );
}

function createEmptyLineItem(): PricingLineItem {
  return {
    id: generateLineItemId(),
    description: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    isOptional: false,
  };
}
