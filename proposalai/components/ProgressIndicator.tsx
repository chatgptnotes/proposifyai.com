'use client';

import CheckIcon from '@mui/icons-material/Check';
import { motion } from 'framer-motion';

interface Step {
  label: string;
  description?: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>

        {/* Active progress line */}
        <motion.div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-primary-600 to-purple-600"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isCurrent = currentStep === stepNumber;
            const isPending = currentStep < stepNumber;

            return (
              <div key={index} className="flex flex-col items-center" style={{ zIndex: 1 }}>
                {/* Circle */}
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg transition-all ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-500 to-green-600 text-white"
                      : isCurrent
                      ? "bg-gradient-to-br from-primary-600 to-purple-600 text-white ring-4 ring-primary-100"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: isCurrent ? Infinity : 0,
                    repeatDelay: 1
                  }}
                >
                  {isCompleted ? (
                    <CheckIcon sx={{ fontSize: 20 }} />
                  ) : (
                    stepNumber
                  )}
                </motion.div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isCurrent
                        ? "text-primary-600"
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-400 mt-1 max-w-[120px]">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-600">
          <span className="font-bold text-primary-600">
            {Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}%
          </span>
          {" "}Complete
        </div>
      </div>
    </div>
  );
}
