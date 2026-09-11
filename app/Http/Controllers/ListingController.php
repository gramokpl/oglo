<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Category;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::query()->active()->with(['category', 'user']);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $vipListings = Listing::query()->vip()->latest()->take(6)->get();
        $promotedListings = Listing::query()->promoted()->latest()->take(12)->get();
        $regularListings = $query->latest()->paginate(15);
        $categories = Category::withCount('listings')->get();

        return view('listings.index', compact('vipListings', 'promotedListings', 'regularListings', 'categories'));
    }

    public function show(string $slug)
    {
        $listing = Listing::where('slug', $slug)->with(['category', 'user'])->firstOrFail();
        $listing->increment('views_count');

        $relatedListings = Listing::where('category_id', $listing->category_id)
            ->where('id', '!=', $listing->id)
            ->active()
            ->take(4)
            ->get();

        return view('listings.show', compact('listing', 'relatedListings'));
    }
}
