export default function Footer() {
  return (
    <footer className="bg-white dark:bg-card border-t border-light-border">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {["Terms", "Privacy", "Cookies"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-para-muted hover:text-primary text-sm"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-para-muted">
            &copy; {new Date().getFullYear()} Merge Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
