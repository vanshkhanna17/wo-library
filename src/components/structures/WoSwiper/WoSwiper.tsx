import { clsx } from "clsx";
import React from "react";
import {
  A11y,
  Autoplay,
  EffectCoverflow,
  FreeMode,
  Mousewheel,
  Navigation,
  Pagination,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "./woSwiper.css";
import styles from "./woSwiper.module.css";

const variants = ["basic", "coverflow"] as const;
const modules = [
  // TODO: creating new wrapper-id for each storyshot run
  EffectCoverflow,
  FreeMode,
  Mousewheel,
  Navigation,
  Autoplay,
  Pagination,
];
if (process.env.JEST_WORKER_ID) {
  modules.push(A11y);
}
type WoSwiperProps = {
  className?: string;
  children: JSX.Element | JSX.Element[];
  fade?: { left: number; right: number };
  freeMode?: object;
  hasSeparator?: boolean;
  moreLink?: string;
  moreLinkVertical?: string;
  navigation?: boolean;
  pagination?: boolean;
  subtitle?: string;
  title?: string;
  variant?: (typeof variants)[number];
};

export default function WoSwiper({
  className,
  children,
  fade,
  freeMode,
  hasSeparator,
  moreLink,
  moreLinkVertical,
  navigation = true,
  subtitle,
  title,
  variant = "basic",
  pagination,
  ...props
}: WoSwiperProps) {
  let derivedProps = {};
  if (variant === "coverflow") {
    derivedProps = {
      coverflowEffect: { depth: 200, modifier: 1, rotate: 5, stretch: 10 },
      // effects
      effect: "coverflow",
      // loop
      loop: true,
    };
  }

  return (
    <div
      className={clsx(
        styles.container,
        styles[`is-${variant}`],
        {
          [styles.hasSeparator]: hasSeparator,
          [styles.hasPagination]: pagination,
        },
        className
      )}
    >
      {(title || subtitle || moreLink) && (
        <div className={styles.top}>
          <div className={styles.topLeft}>
            {title && <h2 className={styles.title}>{title}</h2>}
            {subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
          </div>
          <div>{moreLink && variant !== "coverflow" && moreLink}</div>
        </div>
      )}
      <Swiper
        // modules
        // @ts-ignore: TS2322 because library definition is wrong
        modules={modules}
        pagination={
          pagination
            ? {
                clickable: true,
                dynamicBullets: true,
              }
            : false
        }
        className={styles.swiper}
        // swiper params
        // slides grid
        centeredSlides={variant === "coverflow"}
        spaceBetween={variant === "coverflow" ? 64 : 32}
        slidesPerView={pagination ? 1 : "auto"}
        // freemode
        freeMode={
          pagination
            ? false
            : {
                enabled: true,
                sticky: !navigation,
                ...freeMode,
              }
        }
        // navigation
        navigation={navigation}
        // mousewheel
        mousewheel={{ forceToAxis: true }}
        {...derivedProps}
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <SwiperSlide key={index}>
            {({
              isActive,
              // @ts-expect-error: TS2339 because library definition is wrong
              isDuplicate,
            }) => {
              const extraProps = {} as { viewMode?: string };
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (child.type.displayName === "Card") {
                extraProps.viewMode =
                  variant === "coverflow"
                    ? isActive && !isDuplicate
                      ? "mini"
                      : "thumb"
                    : undefined;
              }
              return React.cloneElement(child, extraProps);
            }}
          </SwiperSlide>
        ))}
        {fade && (
          <>
            <div
              className={styles.fadeLeft}
              style={{ width: fade.left }}
              slot="container-start"
            />
            <div
              className={styles.fadeRight}
              style={{ width: fade.right }}
              slot="container-end"
            />
          </>
        )}
      </Swiper>
      {moreLinkVertical && (
        <div className={styles.bottom}>{moreLinkVertical}</div>
      )}
    </div>
  );
}
