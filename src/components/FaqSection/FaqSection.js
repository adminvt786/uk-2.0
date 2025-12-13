import React, { useState } from 'react';
import classNames from 'classnames';
import Field, { hasDataInFields } from '../../containers/PageBuilder/Field';
import SectionContainer from '../../containers/PageBuilder/SectionBuilder/SectionContainer';
import IconArrowHead from '../IconArrowHead/IconArrowHead';
import css from './FaqSection.module.css';

const FaqSection = props => {
  const {
    title,
    description,
    blocks = [],
    defaultClasses,
    appearance,
    options,
    sectionId,
  } = props;

  const fieldComponents = options?.fieldComponents;
  const fieldOptions = { fieldComponents };
  const hasHeaderFields = hasDataInFields([title, description], fieldOptions);

  // State to track which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState({});

  const toggleItem = blockId => {
    setExpandedItems(prev => ({
      ...prev,
      [blockId]: !prev[blockId],
    }));
  };

  return (
    <SectionContainer
      id={sectionId}
      appearance={appearance}
      options={fieldOptions}
      className={css.root}
    >
      <div className={css.container}>
        {hasHeaderFields && (
          <header className={css.header}>
            <Field data={title} className={css.title} options={fieldOptions} />
            <Field data={description} className={css.description} options={fieldOptions} />
          </header>
        )}

        {blocks.length > 0 && (
          <div className={css.faqCard}>
            {blocks.map((block, index) => {
              const blockId = block.blockId || `faq-${index}`;
              const isExpanded = expandedItems[blockId] || false;
              const isLast = index === blocks.length - 1;

              return (
                <div key={blockId} className={css.faqItem}>
                  <button
                    className={css.faqQuestion}
                    onClick={() => toggleItem(blockId)}
                    aria-expanded={isExpanded}
                  >
                    <div className={css.questionText}>
                      <Field data={block.title} className={css.questionTitle} options={fieldOptions} />
                    </div>
                    <IconArrowHead
                      className={classNames(css.chevron, { [css.chevronExpanded]: isExpanded })}
                      direction="down"
                      size="small"
                    />
                  </button>
                  {isExpanded && (
                    <div className={css.faqAnswer}>
                      <Field data={block.text} className={css.answerText} options={fieldOptions} />
                    </div>
                  )}
                  {!isLast && <div className={css.separator} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SectionContainer>
  );
};

export default FaqSection;
