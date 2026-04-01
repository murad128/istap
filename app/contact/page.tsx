export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Əlaqə</h1>
      <p className="text-gray-500 mb-8">Suallarınız, təklifləriniz və ya xəta bildirişləriniz üçün bizimlə əlaqə saxlayın.</p>
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">📧</div>
          <div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</div>
            <a href="mailto:info@istap.az" className="text-blue-600 font-medium hover:underline">info@istap.az</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">📍</div>
          <div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Ünvan</div>
            <span className="font-medium text-gray-800">Bakı, Azərbaycan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
