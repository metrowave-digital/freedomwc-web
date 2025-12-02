"use client";

import React, { useState } from "react";
import styles from "./FAQ.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export default function FAQ({ items, title }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.wrapper}>
      {title && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.container}>
        {items.map((faq, i) => (
          <div key={i} className={styles.item}>
            <button className={styles.question} onClick={() => toggle(i)}>
              <span>{faq.question}</span>
              {openIndex === i ? (
                <ChevronUp className={styles.icon} />
              ) : (
                <ChevronDown className={styles.icon} />
              )}
            </button>

            <div
              className={`${styles.answerWrapper} ${
                openIndex === i ? styles.open : ""
              }`}
            >
              <p className={styles.answer}>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
