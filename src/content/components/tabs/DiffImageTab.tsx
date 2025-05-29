import { styled } from '@linaria/react'

export const DiffImageWrapper = styled.div`
  line-height: 1.5rem;
  padding: 16px;
  width: 100%;
  text-align: center;

  &[data-img-type='before'] {
    background: #ffeceb;
    color: #ae2e24;
  }

  &[data-img-type='after'] {
    background: #dcfff1;
    color: #216e4e;
  }

  & img,
  & canvas {
    border: 3px solid;
    border-radius: 3px;
    max-width: calc(50vw - 32px);
    max-height: calc(100vh - 300px);
    background-size: 20px 20px;
    background-position:
      0px 0px,
      0px 10px,
      10px -10px,
      -10px 0px;
    background-image: linear-gradient(
        45deg,
        rgb(244, 245, 247) 25%,
        transparent 25%
      ),
      linear-gradient(-45deg, rgb(244, 245, 247) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgb(244, 245, 247) 75%),
      linear-gradient(-45deg, white 75%, rgb(244, 245, 247) 75%);
  }
`

export const DiffImageTab = styled.div`
  padding-top: 8px;
  width: 100%;
  display: flex;
  height: max-content;
  justify-content: center;

  position: relative;
`

export const ImageCaption = styled.div`
  height: 2rem;
  line-height: 1.5rem;
`

export const ImageStack = styled.div`
  position: relative;
  display: inline-block;
  cursor: col-resize;
  width: 100%;
`

export const ImageStackBeforeImageWrapper = styled.div`
  position: relative;

  & > div[data-img-type] {
    width: initial;
  }
`

export const ImageStackAfterImageWrapper = styled('div')<{
  overlayOpacity?: number
  clipX?: number
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: ${({ overlayOpacity }) => overlayOpacity ?? 'unset'};
  clip-path: ${({ clipX }) =>
    clipX ? `inset(0 ${100 - clipX}% 0 0)` : 'unset'};

  & > div[data-img-type] {
    width: initial;
  }
`
