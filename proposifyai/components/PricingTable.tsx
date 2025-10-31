'use client';

// Pricing Table Display Component
// Shows pricing in proposals (read-only view)

import React from 'react';
import { PricingTable as PricingTableType, formatCurrency, calculateLineItemTotal } from '@/types/pricing';

interface PricingTableProps {
  data: PricingTableType;
  className?: string;
}

export default function PricingTable({ data, className = '' }: PricingTableProps) {
  const groupedItems = data.groupByCategory
    ? groupItemsByCategory(data.lineItems)
    : { 'All Items': data.lineItems };

  return (
    <div className={`pricing-table ${className}`}>
      {/* Tiered Pricing */}
      {data.displayMode === 'tiered' && data.tiers && data.tiers.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {data.tiers.map(tier => (
            <TierCard key={tier.id} tier={tier} currency={data.currency} />
          ))}
        </div>
      ) : (
        /* Standard Pricing Table */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                {data.showDiscount && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(groupedItems).map(([category, items]) => (
                <React.Fragment key={category}>
                  {data.groupByCategory && (
                    <tr className="bg-gray-50">
                      <td colSpan={data.showDiscount ? 5 : 4} className="px-6 py-2 text-sm font-semibold text-gray-700">
                        {category}
                      </td>
                    </tr>
                  )}
                  {items.map(item => (
                    <tr key={item.id} className={item.isOptional ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.description}
                            {item.isOptional && (
                              <span className="ml-2 text-xs text-blue-600 font-normal">(Optional)</span>
                            )}
                          </div>
                          {item.notes && (
                            <div className="text-xs text-gray-500 mt-1">{item.notes}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatCurrency(item.unitPrice, data.currency)}
                      </td>
                      {data.showDiscount && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600">
                          {item.discount ? `-${item.discount}%` : item.discountAmount ? `-${formatCurrency(item.discountAmount, data.currency)}` : '-'}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatCurrency(calculateLineItemTotal(item), data.currency)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 max-w-md ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(data.subtotal, data.currency)}
                </span>
              </div>

              {data.showDiscount && data.discountTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(data.discountTotal, data.currency)}
                  </span>
                </div>
              )}

              {data.showTax && data.taxTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Tax {data.taxRate ? `(${data.taxRate}%)` : ''}:
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(data.taxTotal, data.currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-primary-600">
                  {formatCurrency(data.total, data.currency)}
                </span>
              </div>

              {data.depositRequired && (
                <div className="flex justify-between text-sm text-gray-600 mt-2 pt-2 border-t border-gray-200">
                  <span>Deposit Required:</span>
                  <span className="font-medium">
                    {data.depositType === 'percentage'
                      ? `${data.depositRequired}% (${formatCurrency((data.total * data.depositRequired) / 100, data.currency)})`
                      : formatCurrency(data.depositRequired, data.currency)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Terms */}
          {data.paymentTerms && (
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Terms</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.paymentTerms}</p>
            </div>
          )}

          {/* Notes */}
          {data.notes && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Tier Card Component for tiered pricing
function TierCard({ tier, currency }: { tier: any; currency: string }) {
  return (
    <div className={`relative bg-white rounded-lg shadow-md border-2 ${tier.isRecommended ? 'border-primary-500' : 'border-gray-200'} overflow-hidden`}>
      {tier.isRecommended && (
        <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          RECOMMENDED
        </div>
      )}

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
        {tier.description && (
          <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
        )}

        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">
            {formatCurrency(tier.total, currency)}
          </span>
          <span className="text-gray-600 ml-2">total</span>
        </div>

        <ul className="space-y-3 mb-6">
          {tier.items.map((item: any) => (
            <li key={item.id} className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700">{item.description}</span>
            </li>
          ))}
        </ul>

        <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
          tier.isRecommended
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}>
          Select Plan
        </button>
      </div>
    </div>
  );
}

// Helper function to group items by category
function groupItemsByCategory(items: any[]) {
  const grouped: Record<string, any[]> = {};
  items.forEach(item => {
    const category = item.category || 'Uncategorized';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });
  return grouped;
}
