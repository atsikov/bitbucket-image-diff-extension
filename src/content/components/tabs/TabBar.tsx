import { styled } from '@linaria/react'
import { useLayoutEffect, useRef, useState } from 'preact/hooks'
import {
  ACTIVE_TAB_COLOR,
  DEFAULT_SELECTED_TAB,
  INACTIVE_TAB_COLOR,
  SECONDARY_COLOR,
  TAB_HEIGHT,
  TAB_WIDTH,
  TABS_RADIO_GROUP_NAME,
} from '../../constants'

type TabBarProps<T extends string> = {
  options: {
    label: string
    id: T
  }[]
  defaultTab?: T
  disabledTabs?: T[]
  onChange?: (value: T) => void
}

const TabBarContainer = styled.div`
  display: flex;
  position: relative;
  background-color: #f4f5f7;
  box-shadow:
    0 0 1px 0 rgba(24, 94, 224, 0.15),
    0 6px 12px 0 rgba(24, 94, 224, 0.15);
  padding: 4px;
  border-radius: 8px;
  width: fit-content;

  input[type='radio'] {
    position: fixed;
    top: -100px;
  }

  input[type='radio']:checked + label {
    color: ${ACTIVE_TAB_COLOR};
    font-weight: 500;
  }

  input[type='radio']:focus + label {
    outline: 2px solid ${ACTIVE_TAB_COLOR};
  }

  input[type='radio']:disabled + label {
    opacity: 0.5;
    pointer-events: none;
  }
`

const TabBarLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${INACTIVE_TAB_COLOR};
  width: ${TAB_WIDTH};
  height: ${TAB_HEIGHT};
  font-size: 1rem;
  font-weight: 400;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.15s ease-in;
  z-index: 2;
`

const TabBarSlider = styled.span`
  position: absolute;
  display: flex;
  width: ${TAB_WIDTH};
  height: ${TAB_HEIGHT};
  background-color: ${SECONDARY_COLOR};
  z-index: 1;
  border-radius: 8px;
  transition: 0.25s ease-out;
  transform: translateX(calc(100% * ${(props) => props['data-selectedIndex']}));
`

export const TabBar = <T extends string>({
  options,
  defaultTab,
  disabledTabs,
  onChange,
}: TabBarProps<T>) => {
  const defaultFocusedInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedTab, setSelectedTab] = useState(defaultTab)
  const selectedTabIndex = options.findIndex(({ id }) => id === selectedTab)

  useLayoutEffect(() => {
    if (defaultFocusedInputRef.current) {
      defaultFocusedInputRef.current.focus()
    }
  }, [])

  return (
    <TabBarContainer role="tablist">
      {options.map((option) => (
        <>
          <input
            type="radio"
            id={option.id}
            name={TABS_RADIO_GROUP_NAME}
            checked={selectedTab === option.id}
            disabled={disabledTabs?.includes(option.id)}
            autofocus={option.id === DEFAULT_SELECTED_TAB}
            onChange={() => {
              setSelectedTab(option.id)
              onChange?.(option.id)
            }}
            {...(option.id === DEFAULT_SELECTED_TAB
              ? {
                  ref: defaultFocusedInputRef,
                }
              : undefined)}
          />

          <TabBarLabel for={option.id} role="tab">
            {option.label}
          </TabBarLabel>
        </>
      ))}

      <TabBarSlider
        data-selectedIndex={selectedTabIndex === -1 ? 0 : selectedTabIndex}
      />
    </TabBarContainer>
  )
}
